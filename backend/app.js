import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from "./src/routers/auth.router.js";

const app = express();

app.use(express.json());
app.use("/", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
