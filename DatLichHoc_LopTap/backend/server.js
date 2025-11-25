const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ==============================
// 📌 KẾT NỐI DATABASE
// ==============================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456", // Sửa nếu có mật khẩu
    database: "quanly_lichhoc"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ Đã kết nối MySQL: quanly_lichhoc");
});

// ==============================
// 📌 API: Lấy danh sách lớp tập (và số lượng đăng ký hôm nay)
// ==============================
app.get("/api/lop-tap", (req, res) => {
    const sql = `
        SELECT lt.id_lop, lt.ten_lop, lt.lich_tap, lt.so_luong_toi_da,
               lt.gio_bat_dau, lt.gio_ket_thuc,
               hlv.ho_ten AS ten_hlv,
               -- Tính số lượng học viên đã đặt lịch cho ngày TƯƠNG LAI/HÔM NAY (trạng thái 'Đã đặt')
               (SELECT COUNT(*) FROM dat_lich_hoc dl 
                WHERE dl.id_lop = lt.id_lop AND dl.trang_thai = 'Đã đặt') AS so_luong_dang_ky
        FROM lop_tap lt
        LEFT JOIN huan_luyen_vien hlv
        ON lt.id_hlv = hlv.id_hlv
        ORDER BY lt.id_lop ASC;
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// ==============================
// 📌 API: Đặt lịch học mới
// ==============================
app.post("/api/dat-lich", (req, res) => {
    const { id_hoc_vien, id_lop, ngay_hoc } = req.body; 

    if (!id_hoc_vien || !id_lop || !ngay_hoc) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc: học viên, lớp, hoặc ngày học." });
    }

    const sql = `
        INSERT INTO dat_lich_hoc (id_hoc_vien, id_lop, ngay_hoc, trang_thai)
        VALUES (?, ?, ?, 'Đã đặt')
    `;

    db.query(sql, [id_hoc_vien, id_lop, ngay_hoc], err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi Server khi đặt lịch." });
        }
        res.json({ message: "🎉 Đặt lịch thành công!", success: true });
    });
});

// ==============================
// 📌 API: Lấy thống kê
// ==============================
app.get("/api/danh-sach-lich", (req, res) => {
    const sql = `
        SELECT 
            dl.id_lich,
            hv.ho_ten AS ten_hoc_vien,
            hv.email,
            lt.ten_lop,
            hlv.ho_ten AS ten_hlv,
            dl.ngay_hoc,
            DATE_FORMAT(lt.gio_bat_dau, '%H:%i') AS gio_bat_dau,
            dl.trang_thai
        FROM dat_lich_hoc dl
        JOIN hoc_vien hv ON dl.id_hoc_vien = hv.id_hoc_vien
        JOIN lop_tap lt ON dl.id_lop = lt.id_lop
        LEFT JOIN huan_luyen_vien hlv ON lt.id_hlv = hlv.id_hlv
        ORDER BY dl.ngay_hoc DESC, lt.gio_bat_dau ASC;
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

app.get("/", (req, res) => {
    // Trả về một tin nhắn đơn giản
    res.send("✅ Backend đang chạy! Truy cập file index.html để xem giao diện.");
});

// ==============================
// 📌 CHẠY SERVER
// ==============================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});