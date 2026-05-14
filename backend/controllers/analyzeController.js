const { ChatGroq } = require("@langchain/groq");

// For the Standalone Tab (Sentiment & Impact)
const analyzeArticle = async (req, res) => {
    try {
        const { text } = req.body;
        const llm = new ChatGroq({ apiKey: process.env.GROQ_API_KEY, model: "llama-3.1-8b-instant", temperature: 0.1 });

        const prompt = `
            Analyze the following Indian business news article and return ONLY a valid JSON object.
            Structure:
            {
                "sentiment": "Bullish", // or "Bearish" or "Neutral"
                "impactScore": 8, // Number from 1-10
                "takeaways": ["point 1", "point 2", "point 3"]
            }
            Article: ${text}
        `;
        const result = await llm.invoke(prompt);
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        const analysis = JSON.parse(jsonMatch[0]);
        res.status(200).json({ success: true, analysis });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// For the Chat Modal (Deep Dive)
const analyzeDeepDive = async (req, res) => {
    try {
        const { text } = req.body;
        const llm = new ChatGroq({ apiKey: process.env.GROQ_API_KEY, model: "llama-3.1-8b-instant", temperature: 0.1 });

        const prompt = `
            Perform a deep-dive analysis on this summary. Return ONLY a valid JSON object.
            Structure:
            {
                "detailedExplanation": "text",
                "keyInsights": ["point1", "point2"],
                "simplifiedBreakdown": "text",
                "additionalContext": "text",
                "followUpQuestions": ["q1", "q2"]
            }
            Summary: ${text}
        `;
        const result = await llm.invoke(prompt);
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        const analysis = JSON.parse(jsonMatch[0]);
        res.status(200).json({ success: true, analysis });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { analyzeArticle, analyzeDeepDive };