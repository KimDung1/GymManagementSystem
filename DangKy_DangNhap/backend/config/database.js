const mysql = require('mysql2');
require('dotenv').config();

// Tạo connection pool để hiệu suất tốt hơn
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Chuyển đổi sang Promise interface
const promisePool = pool.promise();

// Kiểm tra kết nối
promisePool.getConnection()
  .then(connection => {
    console.log('✅ Đã kết nối thành công đến MySQL Database:', process.env.DB_NAME);
    connection.release();
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối database:', err.message);
  });

module.exports = promisePool;