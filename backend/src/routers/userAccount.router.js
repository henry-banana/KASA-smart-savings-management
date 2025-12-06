// backend/src/routers/auth.router.js
import express from "express";
import { login } from "../controllers/UserAccount/login.controller.js";
import { forgotPassword } from "../controllers/UserAccount/forgotPassword.controller.js";
import { verifyOTPController } from "../controllers/UserAccount/verifyOTP.controller.js";
import { resetPassword } from "../controllers/UserAccount/resetPassword.controller.js";
import { getAllEmployees } from "../controllers/Employee/employee.controller.js";
import {
  createUserAccount,
  updateUserAccount,
  updateStatusAccount,
} from "../controllers/UserAccount/userAccount.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/", createUserAccount);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTPController);
router.post("/reset-password", resetPassword);
router.get("/", getAllEmployees);
router.put("/:id", updateUserAccount);
router.patch("/:id", updateUserAccount);
router.patch("/:id/status", updateStatusAccount);

export default router;
