const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters") ;
const { HfInference } = require("@huggingface/inference") ;
const Article = require("../models/Article.js") ;
const fs = require("fs") ;

const cleanHtml = (str) => {
    if(!str) return "" ;
    return str.replace(/<[^>]*>?/gm , " ").trim() ;
} ;

const ingestData = async (req , res) => {
    try {
        const hf = new HfInference(process.env.HUGGINGFACE_API_KEY) ;
        
        const rawData = fs.readFileSync("./data/Assignment_news.json" , "utf-8") ;
        const articles = JSON.parse(rawData) ;

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000 ,
            chunkOverlap: 200
        }) ;

        for(let i = 0 ; i < articles.length ; i++) {
            const cleanText = cleanHtml(articles[i].story) ;
            if(cleanText.length === 0) continue ;

            const chunks = await splitter.splitText(cleanText) ;
            
            for(let j = 0 ; j < chunks.length ; j++) {
                console.log(`Processing chunk ${j+1} of article ${i+1}...`) ;
                const vector = await hf.featureExtraction({
                    model: "sentence-transformers/all-MiniLM-L6-v2" ,
                    inputs: chunks[j]
                }) ;

                const newChunk = new Article({
                    text: chunks[j] ,
                    metadata: { 
                        title: articles[i].Headline , 
                        source: articles[i].link ,
                        date: articles[i].PublishedAt
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

module.exports = { ingestData } ;