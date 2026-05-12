const express = require("express") ;
const cors = require("cors") ;
const dotenv = require("dotenv") ;
const { connectDB } = require("./config/db.js") ;
const ingestRoutes = require("./routes/ingestRoutes.js") ;
const chatRoutes = require("./routes/chatRoutes.js") ;

dotenv.config() ;
connectDB() ;

const app = express() ;
const port = process.env.PORT || 5000 ;

app.use(cors()) ;
app.use(express.json()) ;
app.use(express.urlencoded({ extended: true })) ;

app.get("/health" , (req , res) => {
    res.status(200).json({ status: "active" }) ;
}) ;

app.use("/api/ingest" , ingestRoutes) ;
app.use("/api/chat" , chatRoutes) ;

app.listen(port , () => {
    console.log(`server running`) ;
}) ;