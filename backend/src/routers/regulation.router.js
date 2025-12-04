import express from "express";
import { getAllRegulations } from "../controllers/Regulation/regulation.controller.js";

const router = express.Router();


router.get("/", getAllRegulations); 

export default router;
