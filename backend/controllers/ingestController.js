import { RecursiveCharacterTextSplitter } from "langchain/text_splitter" ;
import { GoogleGenerativeAI } from "@google/genai" ;
import Article from "../models/Article.js" ;
import fs from "fs" ;

const ingestData = async (req , res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY) ;
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" }) ;
        
        const rawData = fs.readFileSync("./data/Assignment_news.json" , "utf-8") ;
        const articles = JSON.parse(rawData) ;

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000 ,
            chunkOverlap: 200
        }) ;

        for(let i = 0 ; i < articles.length ; i++) {
            const chunks = await splitter.splitText(articles[i].content) ;
            
            for(let j = 0 ; j < chunks.length ; j++) {
                const result = await model.embedContent(chunks[j]) ;
                const vector = result.embedding.values ;

                const newChunk = new Article({
                    text: chunks[j] ,
                    metadata: { 
                        title: articles[i].title , 
                        source: articles[i].source 
                    } ,
                    embedding: vector 
                }) ;
                
                await newChunk.save() ;
            }
        }

        res.status(200).json({ success: true , msg: "ingestion complete" }) ;
    }
    catch(err) {
        console.log(err) ;
        res.status(500).json({ success: false , error: err.message }) ;
    }
} ;

export { ingestData } ;