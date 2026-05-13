const Chat = require("../models/Chat.js") ;

const getHistory = async (req, res) => {
    try {
        // we use MongoDB Aggregation to group messages by sessionId
        const sessions = await Chat.aggregate([
            { $sort: { createdAt: 1 } }, // sort in ascending to find the first msg of the session
            {
                $group: {
                    _id: "$sessionId",
                    userMessage: { $first: "$userMessage" }, // first message as the sidebar "Title"
                    createdAt: { $first: "$createdAt" }
                }
            },
            { $sort: { createdAt: -1 } } // sort in descending so newest sessions are at the top of the sidebar
        ]);

        res.status(200).json({ success: true, data: sessions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getSessionChats = async (req, res) => {
    try {
        const { sessionId } = req.params;
        // fetch all messages with this ID, sorted chronologically
        const chats = await Chat.find({ sessionId }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: chats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getHistory, getSessionChats };