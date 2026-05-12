import express from "express" ;
import { ingestData } from "../controllers/ingestController.js" ;

const router = express.Router() ;

router.post("/" , ingestData) ;

export default router ;