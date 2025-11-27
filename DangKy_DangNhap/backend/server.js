const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Đặt true nếu dùng HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Phục vụ file tĩnh từ frontend
app.use(express.static(path.join(__dirname, '../frontend')));
// PHỤC VỤ FILE TĨNH TỪ THƯ MỤC DatLichHoc_LopTap - THÊM DÒNG NÀY
app.use('/DatLichHoc_LopTap', express.static(path.join(__dirname, '../../DatLichHoc_LopTap')));
// Routes
app.use('/api/auth', authRoutes);

// Route mặc định - phục vụ trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
// THÊM ROUTE CHO TRANG DASHBOARD
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
  });
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});
app.get('/DatLichHoc_LopTap', (req, res) => {
    res.sendFile(path.join(__dirname, '../../DatLichHoc_LopTap/index.html'));
  });
// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên http://localhost:${PORT}`);
  console.log(`📁 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});