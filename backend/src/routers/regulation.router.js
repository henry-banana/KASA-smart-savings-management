import express from "express";
import { getAllRegulations, updateRegulations } from "../controllers/Regulation/regulation.controller.js";

const router = express.Router();


router.get("/", getAllRegulations); 
router.put("/", updateRegulations);

export default router;
