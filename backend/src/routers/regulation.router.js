import express from "express";
import { getAllRegulations, updateRegulations, getRegulationRates, updateSomeRegulation, getHistoryRegulations } from "../controllers/Regulation/regulation.controller.js";
import { validatePositiveNumbers } from "../middleware/validation.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions
const allRoles = checkRole(['accountant', 'admin', 'teller']);


router.get("/", verifyToken, allRoles, getAllRegulations); 
router.put("/", verifyToken, allRoles, validatePositiveNumbers, updateRegulations);
router.get("/interest-rates", verifyToken, allRoles, getRegulationRates);
router.put("/interest-rates", verifyToken, allRoles, updateSomeRegulation);
router.get("/history", verifyToken, allRoles, getHistoryRegulations);
export default router;
