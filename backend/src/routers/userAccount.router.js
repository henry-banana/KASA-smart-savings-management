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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [UserAccount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai thông tin đăng nhập
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Tạo tài khoản người dùng
 *     tags: [UserAccount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 */
router.post("/", createUserAccount);

// --- PROTECTED ROUTES (Requires Token) ---
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin cá nhân
 *     tags: [UserAccount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin cá nhân
 *       401:
 *         description: Không có quyền truy cập
 */
router.get("/me", verifyToken, getMe);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [UserAccount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 */
router.put("/me", verifyToken, updateMe);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     tags: [UserAccount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã gửi email xác thực
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [UserAccount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */
router.post("/change-password", changePassword);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Xác thực OTP
 *     tags: [UserAccount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác thực thành công
 */
router.post("/verify-otp", verifyOTPController);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags: [UserAccount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Lấy danh sách nhân viên
 *     tags: [UserAccount]
 *     responses:
 *       200:
 *         description: Danh sách nhân viên
 */
router.get("/",  getAllEmployees);

// Các route có params (như :id) phải nằm dưới cùng
/**
 * @swagger
 * /api/auth/{id}:
 *   put:
 *     summary: Cập nhật tài khoản theo ID
 *     tags: [UserAccount]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", updateUserAccount);

/**
 * @swagger
 * /api/auth/{id}:
 *   patch:
 *     summary: Cập nhật tài khoản theo ID (patch)
 *     tags: [UserAccount]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch("/:id", updateUserAccount);

/**
 * @swagger
 * /api/auth/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái tài khoản
 *     tags: [UserAccount]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.patch("/:id/status", updateStatusAccount);

export default router;
