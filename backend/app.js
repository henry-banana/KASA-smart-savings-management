import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // <-- import cors
import authRoutes from "./src/routers/userAccount.rouiter.js";
import employeeRoutes from './src/routers/employee.router.js';
import savingBookRoutes from './src/routers/savingBook.router.js';
import transactionRoutes from './src/routers/transaction.router.js';
import customerRoutes from './src/routers/customer.router.js';
import typeSavingRoutes from './src/routers/typeSaving.router.js';

dotenv.config();

const app = express();

// CORS: cho phép frontend từ domain/port khác gọi API
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // nếu cần gửi cookie
}));

app.use(express.json());

app.use("/api/login", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/savingbook", savingBookRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/typesaving", typeSavingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
