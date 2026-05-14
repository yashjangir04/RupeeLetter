const express = require("express");
const { analyzeArticle, analyzeDeepDive } = require("../controllers/analyzeController.js");

const router = express.Router();

router.post("/article", analyzeArticle);
router.post("/deep-dive", analyzeDeepDive);

module.exports = router;