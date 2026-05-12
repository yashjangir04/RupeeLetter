import express from "express" ;
import cors from "cors" ;
import dotenv from "dotenv" ;
import { connectDB } from "./config/db.js" ;
import ingestRoutes from "./routes/ingestRoutes.js" ;

dotenv.config() ;
connectDB() ;

const app = express() ;
const port = process.env.PORT || 5000 ;

app.use(cors()) ;
app.use(express.json()) ;
app.use(express.urlencoded({ extended: true })) ;

app.use("/api/ingest" , ingestRoutes) ;




app.get("/health" , (req , res) => {
    res.status(200).send({
        status : "active"
    }) ;
})

app.listen(PORT , () => {
    console.log(`Server running on PORT:{${PORT}}`) ;
})