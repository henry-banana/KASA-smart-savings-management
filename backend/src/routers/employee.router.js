import express from "express";
import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/Employee/employee.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/employee/add:
 *   post:
 *     summary: Add a new employee and create user account
 *     tags:
 *       - Employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - roleID
 *               - branchID
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               roleID:
 *                 type: integer
 *                 example: 2
 *               branchID:
 *                 type: integer
 *                 example: 1
 *               email:
 *                 type: string
 *                 example: "nguyenvana@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Employee added and account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee added and account created successfully."
 *                 employee:
 *                   $ref: '#/components/schemas/Employee'
 */

/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: Get all employees
 *     tags:
 *       - Employee
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 */

/**
 * @swagger
 * /api/employee/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags:
 *       - Employee
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /api/employee/{id}:
 *   put:
 *     summary: Update employee by ID
 *     tags:
 *       - Employee
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - roleID
 *               - branchID
 *               - email
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               roleID:
 *                 type: integer
 *                 example: 2
 *               branchID:
 *                 type: integer
 *                 example: 1
 *               email:
 *                 type: string
 *                 example: "nguyenvana@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /api/employee/{id}:
 *   delete:
 *     summary: Delete employee by ID
 *     tags:
 *       - Employee
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         employeeid:
 *           type: integer
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         roleID:
 *           type: integer
 *         branchID:
 *           type: integer
 */

import { verifyToken } from "../middleware/auth.middleware.js";


router.post("/add", verifyToken, addEmployee); //Token khi tạo
router.post("/", verifyToken, addEmployee);
router.get("/", verifyToken, getAllEmployees);
router.get("/:id", verifyToken, getEmployeeById);
router.put("/:id", verifyToken, updateEmployee);
router.delete("/:id", verifyToken, deleteEmployee);

export default router;