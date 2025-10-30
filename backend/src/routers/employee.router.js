import express from "express";
import { addEmployee } from "../controllers/Employee/employee.controller.js";

const router = express.Router();

router.post("/add", addEmployee);

export default router;
