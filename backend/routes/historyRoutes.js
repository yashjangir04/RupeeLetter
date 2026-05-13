const express = require('express');
const { getHistory, getSessionChats } = require('../controllers/historyController');
const router = express.Router();

router.get('/', getHistory);
router.get('/:sessionId', getSessionChats);

module.exports = router;