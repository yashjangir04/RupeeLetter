const express = require("express") ;
const app = express() ;
const env = require("dotenv") ;

env.config() ;
const PORT = process.env.PORT ;

app.get("/" , (req , res) => {
    res.send("Hello World :)") ;
})

app.listen(PORT , () => {
    console.log(`Server running on PORT:{${PORT}}`) ;
})