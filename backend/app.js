import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupSwagger } from "./src/config/swagger.js";
import { requestLogger } from "./src/middleware/logger.middleware.js";
import authRoutes from "./src/routers/userAccount.router.js";
import savingBookRoutes from "./src/routers/savingBook.router.js";
import transactionRoutes from "./src/routers/transaction.router.js";
import customerRoutes from "./src/routers/customer.router.js";
import typeSavingRoutes from "./src/routers/typeSaving.router.js";
import reportRoutes from "./src/routers/report.router.js";
import userRoutes from "./src/routers/userAccount.router.js";
import branchRoutes from "./src/routers/branch.router.js";
import regulationRoutes from "./src/routers/regulation.router.js";

dotenv.config();

const app = express();
setupSwagger(app);

// CORS: cho phép frontend từ domain/port khác gọi API
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // nếu cần gửi cookie
  })
);

app.use(express.json());

// Middleware log các request
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/savingbook", savingBookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/typesaving", typeSavingRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/regulations", regulationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log("Swagger docs: http://localhost:3000/api/docs");
});
