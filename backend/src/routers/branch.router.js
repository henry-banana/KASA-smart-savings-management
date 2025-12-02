import express from "express";
import { getAllBranchName } from "../controllers/Branch/branch.controller.js";


const router = express.Router();

router.get("/name", getAllBranchName)

export default router;
