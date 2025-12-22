import express from "express";
import { getAllBranchName } from "../controllers/Branch/branch.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/name", verifyToken, getAllBranchName)

export default router;
