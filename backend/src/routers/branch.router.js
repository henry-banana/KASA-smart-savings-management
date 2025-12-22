import express from "express";
import { getAllBranchName } from "../controllers/Branch/branch.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions - all roles can view branches
const allRoles = checkRole(['teller', 'accountant', 'admin']);

router.get("/name", verifyToken, allRoles, getAllBranchName)

export default router;
