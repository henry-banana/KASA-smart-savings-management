const express = require('express');
const app = express();
const authRoutes = require('./src/routers/auth.router.js');
require('dotenv').config();

app.use(express.json()); // Đọc body JSON
app.use('/api', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
