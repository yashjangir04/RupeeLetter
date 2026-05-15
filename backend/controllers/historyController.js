const Chat = require("../models/Chat.js");
const redisClient = require("../redisClient");

const getHistory = async (req, res) => {
    try {
        const cacheKey = "chat_history:sidebar";
        
        const cachedHistory = await redisClient.get(cacheKey);
        if (cachedHistory) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedHistory) });
        }

        const sessions = await Chat.aggregate([
            { $sort: { createdAt: 1 } },
            {
                $group: {
                    _id: "$sessionId",
                    userMessage: { $first: "$userMessage" },
                    createdAt: { $first: "$createdAt" }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        await redisClient.setEx(cacheKey, 300, JSON.stringify(sessions));

        res.status(200).json({ success: true, data: sessions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSessionChats = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        // 👉 NO CACHE: Always fetch the exact, up-to-date messages from MongoDB
        const chats = await Chat.find({ sessionId }).sort({ createdAt: 1 });
        
        res.status(200).json({ success: true, data: chats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getHistory, getSessionChats };