const express = require("express") ;
const { ingestData } = require("../controllers/ingestController.js") ;

const router = express.Router() ;

router.post("/" , ingestData) ;

module.exports = router ;