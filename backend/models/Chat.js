const mongoose = require("mongoose") ;

const chatSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    userMessage: { type: String, required: true },
    aiResponse: { type: String, required: true },
    sources: { type: Array, default: [] },
    analysis: { type: Object, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);