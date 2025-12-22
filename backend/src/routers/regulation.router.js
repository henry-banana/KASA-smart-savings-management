import express from "express";
import { getAllRegulations, updateRegulations, getRegulationRates, updateSomeRegulation, getHistoryRegulations } from "../controllers/Regulation/regulation.controller.js";
import { validatePositiveNumbers } from "../middleware/validation.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();


router.get("/", verifyToken, getAllRegulations); 
router.put("/", verifyToken, validatePositiveNumbers, updateRegulations);
router.get("/interest-rates", verifyToken, getRegulationRates);
router.put("/interest-rates", verifyToken, updateSomeRegulation);
router.get("/history", verifyToken, getHistoryRegulations);
export default router;
