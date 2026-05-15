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
        if (!message) return res.status(400).json({ success: false, error: "message is required" });

        const activeSessionId = sessionId || Date.now().toString();
        const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

        // STEP 1: Turn the user's question into a mathematical Vector IMMEDIATELY
        const queryVector = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: message
        });

        // STEP 2: Pull our "Semantic Cache" array from Redis
        const cachedData = await redisClient.get("semantic_cache");
        let semanticCache = cachedData ? JSON.parse(cachedData) : [];

        // STEP 3: Loop through past questions and find the closest mathematical match
        let highestScore = 0;
        let bestMatch = null;

        for (const cachedItem of semanticCache) {
            const score = cosineSimilarity(queryVector, cachedItem.vector);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = cachedItem;
            }
        }

        // STEP 4: If the similarity is over 95%, it's practically the same question! Cache Hit!
        if (highestScore >= 0.85 && bestMatch) {
            console.log(`Semantic Cache Hit! (Similarity: ${(highestScore * 100).toFixed(2)}%)`);
            
            // Save this to the user's history so it shows in the sidebar
            const newChat = new ChatModel({
                sessionId: activeSessionId,
                userMessage: message, // We save their exact wording in history
                aiResponse: bestMatch.answer,
                sources: bestMatch.sources
            });
            await newChat.save();
            await redisClient.del("chat_history:sidebar"); // Invalidate sidebar cache

            return res.status(200).json({
                success: true,
                answer: bestMatch.answer,
                sources: bestMatch.sources
            });
        }

        console.log("Semantic Cache Miss. Generating new AI response...");

        // CACHE MISS - normal Groq / MongoDB ..
        
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
        await redisClient.del("chat_history:sidebar"); // Invalidate sidebar cache

        // STEP 6: Save the NEW Vector and Answer to our Semantic Cache for future users!
        semanticCache.push({
            vector: queryVector,
            answer: responseText,
            sources: sources
        });

        // Optional: Keep the cache array from growing infinitely large (e.g., keep the latest 100 questions)
        if (semanticCache.length > 100) {
            semanticCache.shift(); // remove the oldest item
        }

        await redisClient.setEx("semantic_cache", 86400, JSON.stringify(semanticCache)); // Expire in 24 hrs

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