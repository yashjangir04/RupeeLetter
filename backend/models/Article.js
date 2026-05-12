const mongoose = require("mongoose") ;

const articleSchema = new mongoose.Schema({
    text: {
        type: String ,
        required: true
    } ,
    metadata: {
        type: Object ,
        default: {}
    } ,
    embedding: {
        type: [Number] ,
        required: true
    }
} , { timestamps: true }) ;

module.exports = mongoose.model("Article" , articleSchema) ;