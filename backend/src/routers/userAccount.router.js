// backend/src/routers/auth.router.js
import express from "express";
import { login } from "../controllers/UserAccount/login.controller.js";
import { forgotPassword } from "../controllers/UserAccount/forgotPassword.controller.js";
import { verifyOTPController } from "../controllers/UserAccount/verifyOTP.controller.js";
import { resetPassword } from "../controllers/UserAccount/resetPassword.controller.js";
import { getAllEmployees } from "../controllers/Employee/employee.controller.js";
import { changePassword } from "../controllers/UserAccount/changePassword.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createUserAccount,
  updateUserAccount,
  updateStatusAccount,
  getMe,
  updateMe,        
} from "../controllers/UserAccount/userAccount.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/", createUserAccount);
// --- PROTECTED ROUTES (Requires Token) ---
// [QUAN TRỌNG] Route /me phải nằm TRƯỚC route /:id
router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);

router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);
router.post("/verify-otp", verifyOTPController);
router.post("/reset-password", resetPassword);
router.get("/",  getAllEmployees);

// Các route có params (như :id) phải nằm dưới cùng
router.put("/:id", updateUserAccount);
router.patch("/:id", updateUserAccount);
router.patch("/:id/status", updateStatusAccount);

export default router;
