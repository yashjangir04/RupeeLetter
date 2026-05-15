const Chat = require("../models/Chat.js");
const redisClient = require("../redisClient");

const getHistory = async (req, res) => {
    try {
        const cacheKey = "chat_history:sidebar";
        
        // Check Cache
        const cachedHistory = await redisClient.get(cacheKey);
        if (cachedHistory) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedHistory) });
        }

        // Cache Miss: Query Database
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

        // Save to Cache
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(sessions));

        res.status(200).json({ success: true, data: sessions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSessionChats = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const cacheKey = `chat_session:${sessionId}`;

        // Check Cache
        const cachedSession = await redisClient.get(cacheKey);
        if (cachedSession) {
            return res.status(200).json({ success: true, data: JSON.parse(cachedSession) });
        }

        // Cache Miss: Query Database
        const chats = await Chat.find({ sessionId }).sort({ createdAt: 1 });

        // Save to Cache
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(chats));

        res.status(200).json({ success: true, data: chats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getHistory, getSessionChats };