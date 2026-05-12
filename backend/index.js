const express = require("express") ;
const app = express() ;
const env = require("dotenv") ;

env.config() ;
const PORT = process.env.PORT ;

app.get("/" , (req , res) => {
    res.send("Hello World :)") ;
})

app.get("/health" , (req , res) => {
    res.status(200).send({
        status : "active"
    }) ;
})

app.listen(PORT , () => {
    console.log(`Server running on PORT:{${PORT}}`) ;
})