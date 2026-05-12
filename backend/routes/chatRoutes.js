const express = require("express") ;
const { chatWithNews } = require("../controllers/chatController.js") ;

const router = express.Router() ;

router.post("/" , chatWithNews) ;

module.exports = router ;