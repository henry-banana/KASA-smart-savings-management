import express from "express";
import {
  getDailyReport,
  getMonthlyReport,
  getInterestReport,
  getTransactionsReport,
  getSavingBookSummary
} from "../controllers/Report/report.controller.js";

const router = express.Router();


router.get("/daily", getDailyReport);
router.get("/monthly", getMonthlyReport);
router.get("/interest", getInterestReport);
router.get("/transactions", getTransactionsReport);
router.get("/savingbook-summary", getSavingBookSummary);

export default router;
