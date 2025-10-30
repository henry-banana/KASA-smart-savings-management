import express from "express";
import { addEmployee } from "../controllers/employee/employee.controller.js";

const router = express.Router();

router.post("/add", addEmployee);

export default router;
