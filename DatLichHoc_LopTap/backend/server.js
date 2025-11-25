const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const ExcelJS = require('exceljs'); 

const app = express();

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 

// ==============================
// 📌 KẾT NỐI DATABASE
// ==============================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456", // SỬA LẠI NẾU CÓ MẬT KHẨU KHÁC
    database: "quanly_lichhoc" // Đảm bảo database này đã được tạo
});

db.connect(err => {
    if (err) {
        console.error("❌ Lỗi kết nối MySQL:", err);
        throw err; 
    }
    console.log("✅ Đã kết nối MySQL: quanly_lichhoc");
});

// ====================================================================
// ============================ 📌 API CHÍNH ============================
// ====================================================================

// ==============================
// 📌 API MỚI: Cập nhật trạng thái lịch tự động
// ==============================
app.get("/api/update-trang-thai", (req, res) => {
    // Logic: Cập nhật lịch từ 'Đã đặt' sang 'Đã học'
    // nếu ngày học ĐÃ QUA hoặc (ngày học LÀ HÔM NAY VÀ giờ kết thúc ĐÃ QUA)
    const sql = `
        UPDATE dat_lich_hoc dl
        JOIN lop_tap lt ON dl.id_lop = lt.id_lop
        SET dl.trang_thai = 'Đã học'
        WHERE dl.trang_thai = 'Đã đặt' 
        AND (
            dl.ngay_hoc < CURDATE() 
            OR (
                dl.ngay_hoc = CURDATE() 
                AND lt.gio_ket_thuc <= TIME(NOW())
            )
        );
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Lỗi tự động cập nhật trạng thái:", err);
            // Vẫn trả về thành công 200 để client tiếp tục tải data, nhưng có thông báo lỗi
            return res.status(500).json({ 
                message: "Lỗi Server khi cập nhật trạng thái tự động.", 
                error: err,
                success: false
            });
        }
        console.log(`[Auto-Update] Đã cập nhật ${result.affectedRows} lịch thành 'Đã học'.`);
        res.json({ 
            message: `Đã cập nhật ${result.affectedRows} lịch thành 'Đã học'.`, 
            success: true,
            affectedRows: result.affectedRows
        });
    });
});


// ==============================
// 📌 API: Lấy danh sách lớp tập
// ==============================
app.get("/api/lop-tap", (req, res) => {
    const sql = `
        SELECT lt.id_lop, lt.ten_lop, lt.lich_tap, lt.so_luong_toi_da,
               lt.gio_bat_dau, lt.gio_ket_thuc,
               hlv.ho_ten AS ten_hlv,
               -- Tính số lượng học viên đã đặt lịch cho ngày HIỆN TẠI/TƯƠNG LAI
               (SELECT COUNT(*) FROM dat_lich_hoc dl 
                WHERE dl.id_lop = lt.id_lop 
                AND dl.trang_thai = 'Đã đặt'
                AND (dl.ngay_hoc > CURDATE() OR (dl.ngay_hoc = CURDATE() AND lt.gio_ket_thuc > TIME(NOW())))) 
               AS so_luong_dang_ky
        FROM lop_tap lt
        LEFT JOIN huan_luyen_vien hlv
        ON lt.id_hlv = hlv.id_hlv
        ORDER BY lt.id_lop ASC;
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error("❌ Lỗi truy vấn /api/lop-tap:", err);
            return res.status(500).json({ message: "Lỗi Server khi lấy danh sách lớp.", error: err });
        }
        res.json(data);
    });
});

// ==============================
// 📌 API: Đặt lịch học mới
// ==============================
app.post("/api/dat-lich", (req, res) => {
    const { id_hoc_vien, id_lop, ngay_hoc } = req.body; 

    if (!id_hoc_vien || !id_lop || !ngay_hoc) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc: id học viên, id lớp, hoặc ngày học." });
    }

    const today = new Date().toISOString().slice(0, 10);
    if (ngay_hoc < today) {
        return res.status(400).json({ message: "Không thể đặt lịch cho ngày đã qua." });
    }

    const checkSql = `
        SELECT COUNT(*) AS count FROM dat_lich_hoc 
        WHERE id_hoc_vien = ? AND id_lop = ? AND ngay_hoc = ? AND trang_thai IN ('Đã đặt', 'Đã học')
    `;
    db.query(checkSql, [id_hoc_vien, id_lop, ngay_hoc], (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi Server khi kiểm tra lịch." });

        if (results[0].count > 0) {
            return res.status(409).json({ message: "Bạn đã đặt lịch lớp này vào ngày này rồi!", success: false }); 
        }

        const insertSql = `
            INSERT INTO dat_lich_hoc (id_hoc_vien, id_lop, ngay_hoc, trang_thai)
            VALUES (?, ?, ?, 'Đã đặt')
        `;

        db.query(insertSql, [id_hoc_vien, id_lop, ngay_hoc], insertErr => {
            if (insertErr) {
                console.error("❌ Lỗi Server khi đặt lịch:", insertErr);
                return res.status(500).json({ message: "Lỗi Server khi đặt lịch." });
            }
            res.json({ message: "🎉 Đặt lịch thành công!", success: true });
        });
    });
});

// ==============================
// 📌 API: Thêm Lớp học mới
// ==============================
app.post("/api/lop-tap/them-moi", (req, res) => {
    const { ten_lop, lich_tap, so_luong_toi_da, gio_bat_dau, gio_ket_thuc, id_hlv } = req.body; 

    if (!ten_lop || !lich_tap || !so_luong_toi_da || !gio_bat_dau || !gio_ket_thuc) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc của lớp học." });
    }
    
    if (so_luong_toi_da <= 0) {
        return res.status(400).json({ message: "Số lượng tối đa phải lớn hơn 0." });
    }

    const sql = `
        INSERT INTO lop_tap (ten_lop, lich_tap, so_luong_toi_da, gio_bat_dau, gio_ket_thuc, id_hlv)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [ten_lop, lich_tap, so_luong_toi_da, gio_bat_dau, gio_ket_thuc, id_hlv || null];

    db.query(sql, params, err => {
        if (err) {
            console.error("❌ Lỗi thêm lớp học:", err);
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: "ID Huấn Luyện Viên không tồn tại." });
            }
            return res.status(500).json({ message: "Lỗi Server khi thêm lớp học." });
        }
        res.json({ message: "🎉 Thêm lớp học mới thành công!", success: true });
    });
});

// ==============================
// 📌 API: Xóa Lớp tập theo ID
// ==============================
app.delete("/api/lop-tap/:id_lop", (req, res) => {
    const id_lop = req.params.id_lop;

    const sql = `DELETE FROM lop_tap WHERE id_lop = ?`;
    
    db.query(sql, [id_lop], (err, result) => {
        if (err) {
            console.error("❌ Lỗi Server khi xóa lớp:", err);
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                 return res.status(409).json({ message: "Không thể xóa lớp này vì vẫn còn lịch đặt liên quan." });
            }
            return res.status(500).json({ message: "Lỗi Server khi xóa lớp." });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy lớp học cần xóa." });
        }

        res.json({ message: `🗑️ Đã xóa lớp ID ${id_lop} thành công!`, success: true });
    });
});


// ==============================
// 📌 API: Lấy danh sách tất cả lịch đã đặt
// ==============================
app.get("/api/danh-sach-lich", async (req, res) => {
    // 1. Tự động cập nhật trạng thái trước khi lấy dữ liệu
    try {
        await new Promise((resolve, reject) => {
            db.query(`
                UPDATE dat_lich_hoc dl
                JOIN lop_tap lt ON dl.id_lop = lt.id_lop
                SET dl.trang_thai = 'Đã học'
                WHERE dl.trang_thai = 'Đã đặt' 
                AND (
                    dl.ngay_hoc < CURDATE() 
                    OR (
                        dl.ngay_hoc = CURDATE() 
                        AND lt.gio_ket_thuc <= TIME(NOW())
                    )
                );
            `, (err, result) => {
                if (err) {
                    console.error("❌ Lỗi tự động cập nhật trạng thái trong /danh-sach-lich:", err);
                    // Không chặn request, chỉ log lỗi
                } else {
                    console.log(`[Auto-Update on Load] Đã cập nhật ${result.affectedRows} lịch thành 'Đã học'.`);
                }
                resolve(); // Tiếp tục dù có lỗi cập nhật hay không
            });
        });
    } catch (e) {
        // Bỏ qua lỗi
    }


    // 2. Lấy dữ liệu lịch đặt sau khi đã cập nhật
    const sql = `
        SELECT 
            dl.id_lich,
            hv.ho_ten AS ten_hoc_vien,
            hv.email,
            lt.ten_lop,
            hlv.ho_ten AS ten_hlv,
            DATE_FORMAT(dl.ngay_hoc, '%d/%m/%Y') AS ngay_hoc, 
            TIME_FORMAT(lt.gio_bat_dau, '%H:%i') AS gio_bat_dau,
            dl.trang_thai
        FROM dat_lich_hoc dl
        JOIN hoc_vien hv ON dl.id_hoc_vien = hv.id_hoc_vien
        JOIN lop_tap lt ON dl.id_lop = lt.id_lop
        LEFT JOIN huan_luyen_vien hlv ON lt.id_hlv = hlv.id_hlv
        ORDER BY dl.ngay_hoc DESC, lt.gio_bat_dau ASC;
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error("❌ Lỗi truy vấn /api/danh-sach-lich:", err);
            return res.status(500).json({ message: "Lỗi Server khi lấy danh sách lịch.", error: err });
        }
        res.json(data);
    });
});

// ==============================
// 📌 API: Xóa Lịch Đặt theo ID (Dùng cho Xóa Mục Đã Chọn)
// ==============================
app.delete("/api/dat-lich/:id_lich", (req, res) => {
    const id_lich = req.params.id_lich;

    const sql = `DELETE FROM dat_lich_hoc WHERE id_lich = ?`;
    
    db.query(sql, [id_lich], (err, result) => {
        if (err) {
            console.error("❌ Lỗi Server khi xóa lịch đặt:", err);
            return res.status(500).json({ message: "Lỗi Server khi xóa lịch đặt." });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy lịch đặt cần xóa." });
        }

        res.json({ message: `🗑️ Đã hủy lịch ID ${id_lich} thành công!`, success: true });
    });
});

// ==============================
// 📌 API: Xóa TOÀN BỘ Danh Sách Lịch Đặt (Dùng cho nút Xóa Toàn Bộ)
// ==============================
app.delete("/api/danh-sach-lich", (req, res) => {
    // Xóa toàn bộ dữ liệu lịch đặt
    const sql = `DELETE FROM dat_lich_hoc`; 
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Lỗi Server khi xóa toàn bộ lịch đặt:", err);
            return res.status(500).json({ message: "Lỗi Server khi xóa toàn bộ lịch đặt." });
        }
        
        res.json({ 
            message: `🗑️ Đã xóa thành công ${result.affectedRows} lịch đặt!`, 
            success: true 
        });
    });
});


// ====================================================================
// ======================= 📌 API TÁC VỤ NHANH =======================
// ====================================================================

// ... (Các API tác vụ nhanh khác giữ nguyên)

// ==============================================
// 📌 API: Lấy Lịch Huấn Luyện Viên (Xuất ra file EXCEL)
// ==============================================
app.get("/api/hlv/:id_hlv/lich", async (req, res) => {
    const id_hlv = req.params.id_hlv;

    if (isNaN(parseInt(id_hlv))) {
        return res.status(400).json({ message: "ID huấn luyện viên không hợp lệ." });
    }

    // Truy vấn lấy lịch dạy của HLV cho các lớp sắp tới (Đã đặt và còn thời gian)
    const sql = `
        SELECT 
            lt.ten_lop AS TenLop,
            DATE_FORMAT(dl.ngay_hoc, '%d/%m/%Y') AS NgayHoc,
            TIME_FORMAT(lt.gio_bat_dau, '%H:%i') AS GioBatDau,
            COUNT(dl.id_lich) AS SoHocVien
        FROM lop_tap lt
        JOIN dat_lich_hoc dl ON lt.id_lop = dl.id_lop
        WHERE lt.id_hlv = ? 
        AND dl.trang_thai = 'Đã đặt' 
        AND (dl.ngay_hoc > CURDATE() OR (dl.ngay_hoc = CURDATE() AND lt.gio_ket_thuc > TIME(NOW())))
        GROUP BY lt.ten_lop, dl.ngay_hoc, lt.gio_bat_dau
        ORDER BY dl.ngay_hoc ASC, lt.gio_bat_dau ASC;
    `;

    db.query(sql, [id_hlv], async (err, data) => {
        if (err) {
            console.error("❌ Lỗi truy vấn lịch HLV:", err);
            return res.status(500).json({ message: "Lỗi Server khi truy vấn dữ liệu lịch HLV." });
        }
        
        // --- 1. TẠO WORKBOOK VÀ WORKSHEET ---
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`LichHLV_${id_hlv}`);
        
        // --- THÊM TIÊU ĐỀ BÁO CÁO ---
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').value = `LỊCH LÀM VIỆC CỦA HUẤN LUYỆN VIÊN ID: ${id_hlv}`;
        worksheet.getCell('A1').font = { bold: true, size: 14 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        // Dòng 2 trống
        
        // --- 2. ĐỊNH NGHĨA HEADER (Tiêu đề cột) ---
        worksheet.getRow(3).values = ['Tên Lớp', 'Ngày Học', 'Giờ Bắt Đầu', 'Số Học Viên'];
        worksheet.columns = [
            { header: 'Tên Lớp', key: 'TenLop', width: 35 },
            { header: 'Ngày Học', key: 'NgayHoc', width: 15 },
            { header: 'Giờ Bắt Đầu', key: 'GioBatDau', width: 15 },
            { header: 'Số Học Viên', key: 'SoHocVien', width: 18 }
        ];

        // Tạo style cho header
        worksheet.getRow(3).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF0F8FF' } // Light Blue background
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        // --- 3. THÊM DỮ LIỆU ---
        worksheet.addRows(data.map(row => [row.TenLop, row.NgayHoc, row.GioBatDau, row.SoHocVien]));

        // --- 4. GỬI FILE VỀ CLIENT ---
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + `LichHLV_${id_hlv}_` + new Date().toISOString().slice(0, 10) + '.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end(); // Kết thúc response

        console.log(`✅ Đã xuất lịch HLV ID ${id_hlv} ra Excel thành công.`);
    });
});

// ==============================
// 📌 API: Xuất Báo Cáo Đăng Ký (Xuất ra file EXCEL)
// ==============================
app.get("/api/bao-cao/tong-hop", async (req, res) => {
    const sql = `
        SELECT 
            lt.ten_lop AS TenLop,
            hlv.ho_ten AS TenHLV,
            lt.so_luong_toi_da AS SoLuongToiDa,
            COUNT(CASE WHEN dl.trang_thai = 'Đã đặt' AND (dl.ngay_hoc > CURDATE() OR (dl.ngay_hoc = CURDATE() AND lt.gio_ket_thuc > TIME(NOW()))) THEN 1 END) AS DangKySapToi,
            COUNT(CASE WHEN dl.trang_thai = 'Đã học' THEN 1 END) AS SoLuongDaHoc
        FROM lop_tap lt
        LEFT JOIN huan_luyen_vien hlv ON lt.id_hlv = hlv.id_hlv
        LEFT JOIN dat_lich_hoc dl ON lt.id_lop = dl.id_lop
        GROUP BY lt.id_lop, lt.ten_lop, hlv.ho_ten, lt.so_luong_toi_da
        ORDER BY DangKySapToi DESC;
    `;

    db.query(sql, async (err, data) => {
        if (err) {
            console.error("❌ Lỗi truy vấn báo cáo:", err);
            return res.status(500).json({ message: "Lỗi Server khi truy vấn dữ liệu báo cáo." });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('BaoCaoDangKy');

        worksheet.columns = [
            { header: 'Tên Lớp', key: 'TenLop', width: 30 },
            { header: 'Huấn Luyện Viên', key: 'TenHLV', width: 25 },
            { header: 'S.Lượng Tối Đa', key: 'SoLuongToiDa', width: 15 },
            { header: 'Đăng Ký Sắp Tới', key: 'DangKySapToi', width: 18 },
            { header: 'Số Lượng Đã Học', key: 'SoLuongDaHoc', width: 18 }
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' } 
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        worksheet.addRows(data);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'BaoCaoDangKyTap_' + new Date().toISOString().slice(0, 10) + '.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end(); 
    });
});

// ==============================
// 📌 API Mặc định (kiểm tra trạng thái)
// ==============================
app.get("/", (req, res) => {
    res.send("✅ Backend Gym Scheduler đang chạy! Truy cập API bằng /api/...");
});


// ==============================
// 📌 CHẠY SERVER
// ==============================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    console.log(`💻 Để chạy frontend, mở file index.html trong trình duyệt.`);
    // Chạy cập nhật trạng thái tự động lần đầu khi server khởi động
    // Sau đó mỗi khi API danh-sach-lich được gọi, nó sẽ tự update
    db.query(`
        UPDATE dat_lich_hoc dl
        JOIN lop_tap lt ON dl.id_lop = lt.id_lop
        SET dl.trang_thai = 'Đã học'
        WHERE dl.trang_thai = 'Đã đặt' 
        AND (
            dl.ngay_hoc < CURDATE() 
            OR (
                dl.ngay_hoc = CURDATE() 
                AND lt.gio_ket_thuc <= TIME(NOW())
            )
        );
    `, (err, result) => {
        if (!err) {
            console.log(`[INIT] Đã cập nhật ${result.affectedRows} lịch cũ thành 'Đã học'.`);
        }
    });
});