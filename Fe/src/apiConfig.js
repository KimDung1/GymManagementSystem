// src/apiConfig.js

// Ưu tiên đọc từ biến môi trường Vite nếu có:
// VITE_API_BASE_URL = "https://mangement-gym.onrender.com"
const DEFAULT_API_BASE_URL = "https://mangement-gym.onrender.com";

export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

// Khi dev local, bạn có thể:
// 1. Tạo file .env.local với dòng:
//    VITE_API_BASE_URL="http://localhost:3001"
// 2. Hoặc sửa DEFAULT_API_BASE_URL ở trên cho nhanh.
