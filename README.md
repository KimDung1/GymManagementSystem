# GymManagementSystem
## 5 chức năng chính
- QuanLyHoiVien - Viết Ngọc
- QuanLyGoiTap - anh duy
- QuanLyHLV- Nhật Thành
- DatLichHoc_LopTap -tấn dũng
- DangKy_DangNhap -kim dung



git clone https://github.com/KimDung1/GymManagementSystem.git
cd GymManagementSystem
git checkout branch-cua-ho( quanly-hoivien, quanly-goitap, quanly-hlv, dat-lich-hoc-lop-tap, dangky-dangnhap)


## kiểm tra nhánh
git branch

## Khi code xong:

git add .
git commit -m "Hoàn thành chức năng X"
git push

# 👤 Lê Nguyễn Nhật Thành  
## 📂 1. QuanLyHLV – Quản lý Huấn Luyện Viên

### 🔥 Tính năng chính
- Xem danh sách HLV (ID, tên, chuyên môn, email, số ĐT, giới hạn học viên, trạng thái).
- Thêm HLV qua modal.
- Sửa thông tin HLV (form tự động điền lại dữ liệu).
- Xóa HLV (confirm hộp thoại).
- **Sinh ID tự động** – dạng `HLV001`, `HLV002`, …
- **Lưu dữ liệu vào localStorage**, load lại trang không bị mất.
- Giao diện dạng **UI dashboard** với bảng + sidebar + responsive cơ bản.

### 🛠 Công nghệ sử dụng
- HTML5  
- CSS3  
- JavaScript (localStorage + DOM + modal logic)

### 📁 Cấu trúc thư mục
```

QuanLyHLV/
├─ index.html
├─ style.css
└─ script.js

```

### ▶️ Cách chạy
1. Mở thư mục **QuanLyHLV**  
2. Click **index.html** hoặc chạy bằng **Live Server**  
3. Dữ liệu tự động load từ **localStorage**

---

# 👤 Lê Viết Ngọc  
## 📂 2. QuanLyHoiVien – Quản lý Hội Viên

### 🔥 Tính năng chính
- Xem danh sách hội viên (ID, tên, SĐT, trạng thái, gói tập, ngày hết hạn).
- Thêm hội viên bằng modal.
- Sửa thông tin (tự fill lại dữ liệu).
- Xóa hội viên (confirm hộp thoại).
- **Sinh ID tự tăng** (ID cuối + 1).
- Giao diện dashboard thống nhất với module HLV.

> ⚠️ **Lưu ý:** phiên bản này **chưa dùng localStorage**, nên reload trang sẽ reset về dữ liệu mặc định.

### 🛠 Công nghệ sử dụng
- HTML5  
- CSS3  
- JavaScript (DOM manipulation)

### 📁 Cấu trúc thư mục
```

QuanLyHoiVien/
├─ index.html
├─ style.css
└─ script.js

```

### ▶️ Cách chạy
1. Mở thư mục **QuanLyHoiVien**  
2. Click **index.html** hoặc dùng **Live Server**

# Lê Kim Dũng
##🏋️ Hệ Thống Đăng Ký & Đăng Nhập - Phòng Gym

## 📦 Cài Đặt & Chạy

1. **Clone repository và chuyển sang nhánh đăng nhập:**
   ```bash
   git clone https://github.com/KimDung1/GymManagementSystem.git
   cd GymManagementSystem
   git checkout dangky-dangnhap
   cd DangKy_DangNhap/backend
   npm install
   npm start
    ```
   Truy cập:
   http://localhost:3000
2. **⚡ Hoạt động **
   Đăng ký
   Tạo tài khoản mới → Lưu database

   Đăng nhập
   Kiểm tra email/mật khẩu → Tạo session

   Chuyển hướng
   Sau đăng nhập → Trang đặt lịch học

3. **👤 Test nhanh **
 ```
Email: admin@example.com

Mật khẩu: 123456
 ```
4. **📁 Cấu trúc**
 ```
backend/   - Server Node.js + MySQL
frontend/  - Giao diện đăng nhập/đăng ký

#📅 MODULE: ĐẶT LỊCH HỌC & LỚP TẬP (DatLichHoc_LopTap)
##👤 Tấn Dũng
###📂 1. DatLichHoc_LopTap – Đặt Lịch Học & Lớp Tập
###🔥 Tính năng chính
-Xem danh sách Lớp Tập đang mở (ID, tên, lịch, giờ, HLV, số lượng đăng ký/tối đa).
-Thêm Lớp Mới qua modal (gọi API).
-Đặt Lịch Học cho học viên (modal xác nhận, kiểm tra trùng lịch).
-Xem và Quản lý Danh sách Lịch Đã Đặt (HV, Lớp, Ngày, Trạng thái).
-Cập nhật Trạng thái Tự động: Backend tự động chuyển lịch đã qua ngày/giờ sang Đã học.
-Xóa Lịch Đặt Hàng Loạt: Cho phép chọn (tích) nhiều mục và xóa (Bulk Delete).
-Báo Cáo Excel: Xuất báo cáo tổng hợp và lịch HLV ra file .xlsx.
-Nhắc Lịch (15p): Kích hoạt dịch vụ alert trên trình duyệt 15 phút trước giờ tập.
###🛠 Công nghệ sử dụng
-Backend: Node.js (Express) và MySQL.
-Dependencies: mysql2, cors, bodyParser, exceljs.
-Frontend: HTML5, CSS3, JavaScript (Fetch API, DOM Manipulation, Modal logic).
###📁 Cấu trúc thư mục
```
DatLichHoc_LopTap/
├─ index.html        <-- Giao diện Frontend
├─ style.css         <-- CSS
└─ backend/
   └─ server.js      <-- Backend API (Node.js/Express)

```
###▶️ Cách chạy
-Để chạy module full-stack này, bạn cần thực hiện 3 bước: Cấu hình DB, Khởi động Backend, và Mở Frontend.
-Cấu hình Database: Đảm bảo MySQL Server đang chạy và database quanly_lichhoc đã được tạo.
-Khởi động Backend:
-Mở Terminal/PowerShell và gõ lệnh
```bash
 cd GymManagementSystem\DatLichHoc_LopTap\backend.
 npm install
 npm install express mysql2 cors body-parser exceljs
 node -v
```
-Chạy lệnh: node server.js
-(Server phải báo 🚀 Server chạy tại http://localhost:5000)
-Mở Frontend:
-Mở thư mục DatLichHoc_LopTap.
-Click đúp vào file index.html hoặc chạy bằng Live Server.
-(Frontend sẽ tự động gọi API từ cổng 5000 để load dữ liệu.)
