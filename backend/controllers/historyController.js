const Chat = require("../models/Chat.js") ;

const getHistory = async (req , res) => {
    try {
        // We sort by createdAt: -1 to show the newest chats at the top
        // limit = 20 so the sidebar doesn't get overwhelmed
        const history = await Chat.find().sort({ createdAt: -1 }).limit(20) ;
        
        res.status(200).json({ 
            success: true , 
            data: history 
        }) ;
    }
    catch(err) {
        console.error("Error fetching history:" , err) ;
        res.status(500).json({ success: false , error: err.message }) ;
    }
} ;

module.exports = { getHistory } ;