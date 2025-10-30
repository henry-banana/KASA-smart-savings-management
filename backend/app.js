import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from "./src/routers/login.router.js";
import employeeRoutes from './src/routers/employee.router.js';

const app = express();

app.use(express.json());
app.use("/api/login", authRoutes);
app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
