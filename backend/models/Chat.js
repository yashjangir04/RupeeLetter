const mongoose = require("mongoose") ;

const chatSchema = new mongoose.Schema({
    userMessage: {
        type: String ,
        required: true
    } ,
    aiResponse: {
        type: String ,
        required: true
    } ,
    sources: {
        type: Array ,
        default: []
    }
} , { timestamps: true }) ;

module.exports = mongoose.model("Chat" , chatSchema) ;