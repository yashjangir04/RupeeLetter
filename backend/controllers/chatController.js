const { ChatGroq } = require("@langchain/groq");
const { HfInference } = require("@huggingface/inference");
const ChatModel = require("../models/Chat.js");
const Article = require("../models/Article.js");
const redisClient = require("../redisClient");

const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const chatWithNews = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, error: "message is required" });
        }

        const activeSessionId = sessionId || Date.now().toString();
        const cacheKey = `chat:${message.toLowerCase().trim()}`;

        // 1. Check Redis Cache
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            const { answer, sources } = JSON.parse(cachedData);

            const newChat = new ChatModel({
                sessionId: activeSessionId,
                userMessage: message,
                aiResponse: answer,
                sources: sources
            });
            await newChat.save();

            await redisClient.del("chat_history:sidebar");
            await redisClient.del(`chat_session:${activeSessionId}`);

            return res.status(200).json({
                success: true,
                answer,
                sources
            });
        }

        // 2. Cache Miss: Process via LLM
        const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
        const queryVector = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: message
        });

        const allArticles = await Article.find({});

        const scoredArticles = allArticles.map(article => {
            const score = cosineSimilarity(queryVector, article.embedding);
            return { ...article.toObject(), score };
        });

        scoredArticles.sort((a, b) => b.score - a.score);
        const topContexts = scoredArticles.slice(0, 3);

        let contextText = "";
        let sources = [];

        for (let i = 0; i < topContexts.length; i++) {
            contextText += `Chunk ${i + 1}:\n${topContexts[i].text}\n\n`;
            sources.push(topContexts[i].metadata);
        }

        const llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.1-8b-instant"
        });

        const prompt = `
            System: You are an AI News Assistant. Answer the user's question strictly using ONLY the context provided below.
            If the answer is not contained in the context, say "I cannot answer this based on the provided news data."

            ---
            CONTEXT:
            ${contextText}
            ---

            USER QUESTION: ${message}
        `;

        const result = await llm.invoke(prompt);
        const responseText = result.content;

        const newChat = new ChatModel({
            sessionId: activeSessionId,
            userMessage: message,
            aiResponse: responseText,
            sources: sources
        });
        await newChat.save();

        // 3. Save to Redis Cache (Expires in 24 hours / 86400 seconds)
        const cachePayload = JSON.stringify({ answer: responseText, sources });
        await redisClient.setEx(cacheKey, 86400, cachePayload);

        res.status(200).json({
            success: true,
            answer: responseText,
            sources: sources
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { chatWithNews };