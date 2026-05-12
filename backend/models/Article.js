import mongoose from "mongoose" ;

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

export default mongoose.model("Article" , articleSchema) ;