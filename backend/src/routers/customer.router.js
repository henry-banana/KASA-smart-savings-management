import express from "express";
import {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomer,
} from "../controllers/Customer/customer.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions
const teller = checkRole(['teller']);
const tellerOrAccountant = checkRole(['teller', 'accountant']);

/**
 * @swagger
 * /api/customer/search:
 *   get:
 *     summary: Search customer by ID or name
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID or name
 *     responses:
 *       200:
 *         description: List of matching customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get("/search", verifyToken, tellerOrAccountant, searchCustomer);

/**
 * @swagger
 * /api/customer/add:
 *   post:
 *     summary: Add a new customer
 *     tags:
 *       - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - citizenId
 *               - street
 *               - district
 *               - province
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Hiep Le Tan"
 *               citizenId:
 *                 type: string
 *                 example: "0123"
 *               street:
 *                 type: string
 *                 example: "Vo Van Ngan"
 *               district:
 *                 type: string
 *                 example: "1"
 *               province:
 *                 type: string
 *                 example: "HCM"
 *     responses:
 *       201:
 *         description: Customer added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 */
router.post("/", verifyToken, teller, addCustomer);


/**
 * @swagger
 * /api/customer:
 *   get:
 *     summary: Get all customers
 *     tags:
 *       - Customer
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
//router.get("/", verifyToken, tellerOrAccountant, getAllCustomers);

// Route: GET /
// Description: Lấy danh sách khách hàng HOẶC tìm theo CitizenId
// Auth: Yêu cầu Token hợp lệ + Role là (Teller hoặc Accountant)
  router.get("/", 
    verifyToken, 
    tellerOrAccountant, 
    (req, res, next) => {
      // 1. Logic ưu tiên: Tìm kiếm cụ thể
      if (req.query.citizenId) {
          // Có thể thêm log audit tại đây nếu cần thiết
          return getCustomerByCitizenId(req, res, next);
      }
      
      // 2. Logic mặc định: Lấy danh sách tổng
      return getAllCustomers(req, res, next);
  });
/**
 * @swagger
 * /api/customer/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */
router.get("/:id", verifyToken, tellerOrAccountant, getCustomerById);

/**
 * @swagger
 * /api/customer/{id}:
 *   put:
 *     summary: Update customer by ID
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */
router.put("/:id", verifyToken, teller, updateCustomer);

/**
 * @swagger
 * /api/customer/{id}:
 *   delete:
 *     summary: Delete customer by ID
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 */
router.delete("/:id", verifyToken, tellerOrAccountant, deleteCustomer);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         customerid:
 *           type: integer
 *         fullname:
 *           type: string
 *         citizenid:
 *           type: string
 *         street:
 *           type: string
 *         district:
 *           type: string
 *         province:
 *           type: string
 *     CustomerInput:
 *       type: object
 *       required:
 *         - fullname
 *         - citizenid
 *         - street
 *         - district
 *         - province
 *       properties:
 *         fullname:
 *           type: string
 *         citizenid:
 *           type: string
 *         street:
 *           type: string
 *         district:
 *           type: string
 *         province:
 *           type: string
 */
