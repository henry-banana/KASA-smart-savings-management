import express from "express";
import { getAllRegulations, updateRegulations, getRegulationRates, updateSomeRegulation, getHistoryRegulations } from "../controllers/Regulation/regulation.controller.js";
import { validatePositiveNumbers } from "../middleware/validation.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions
const accountantOrAdmin = checkRole(['accountant', 'admin']);


router.get("/", verifyToken, accountantOrAdmin, getAllRegulations); 
router.put("/", verifyToken, accountantOrAdmin, validatePositiveNumbers, updateRegulations);
router.get("/interest-rates", verifyToken, accountantOrAdmin, getRegulationRates);
router.put("/interest-rates", verifyToken, accountantOrAdmin, updateSomeRegulation);
router.get("/history", verifyToken, accountantOrAdmin, getHistoryRegulations);
export default router;
