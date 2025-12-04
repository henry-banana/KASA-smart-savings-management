import express from "express";
import { getAllRegulations, updateRegulations, getRegulationRates, updateSomeRegulation } from "../controllers/Regulation/regulation.controller.js";
import { validatePositiveNumbers } from "../middleware/validation.middleware.js";

const router = express.Router();


router.get("/", getAllRegulations); 
router.put("/", validatePositiveNumbers, updateRegulations);
router.get("/interest-rates", getRegulationRates);
router.put("/interest-rates", updateSomeRegulation);

export default router;
