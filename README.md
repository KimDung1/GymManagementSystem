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
 ```
# 📅 MODULE: ĐẶT LỊCH HỌC & LỚP TẬP (DatLichHoc_LopTap)

Một phần của Hệ thống Quản lý Phòng Gym (Gym Management System) - Phát triển bởi **Tấn Dũng**.

---

## 💡 Giới Thiệu

Module **DatLichHoc_LopTap** cung cấp giao diện và API mạnh mẽ để quản lý lịch học cá nhân (PT) và lịch các lớp tập nhóm (Group Class) một cách hiệu quả. Module này hỗ trợ từ việc xem lịch, đăng ký lịch tập cho học viên, đến việc quản lý, báo cáo và nhắc nhở lịch tập.

## 🔥 Tính năng Chính

* **Danh sách Lớp Tập Mở:** Hiển thị thông tin chi tiết các lớp đang mở:
    * **ID Lớp**, **Tên Lớp**, **Lịch (Ngày/Thứ)**, **Giờ Tập**, **Huấn Luyện Viên (HLV)**.
    * **Số lượng Đăng ký / Tối đa** (Giúp theo dõi tình trạng lớp).
* **Thêm Lớp Mới:** Hỗ trợ tạo lớp tập mới thông qua Modal trực quan (gọi API Backend).
* **Đặt Lịch Học:**
    * Cho phép học viên đăng ký vào lớp/buổi học mong muốn.
    * Modal **xác nhận** thông tin chi tiết.
    * **Kiểm tra trùng lịch** thông minh để tránh xung đột giờ học.
* **Quản lý Lịch Đã Đặt:**
    * Xem **Danh sách Lịch Đã Đặt** chi tiết (Học viên, Lớp, Ngày, Trạng thái).
    * **Cập nhật Trạng thái Tự động:** Backend tự động chuyển lịch tập đã qua ngày/giờ sang trạng thái **"Đã học"**.
* **Xóa Lịch Đặt Hàng Loạt (Bulk Delete):** Cho phép chọn (tích) nhiều lịch đã đặt và thực hiện xóa cùng lúc.
* **Báo Cáo:**
    * Xuất báo cáo tổng hợp lịch tập ra file **.xlsx** (Excel).
    * Xuất lịch làm việc chi tiết của từng **HLV** ra file **.xlsx**.
* **Nhắc Lịch Tập (15p):** Kích hoạt dịch vụ **Alert** trên trình duyệt để nhắc nhở học viên 15 phút trước giờ tập (chỉ áp dụng cho Frontend đang mở).

---

## 🛠 Công nghệ Sử dụng

| Phạm vi | Công nghệ | Dependencies/Libraries |
| :--- | :--- | :--- |
| **Backend** | **Node.js** (Express Framework) | `mysql2`, `cors`, `body-parser`, `exceljs` |
| **Database** | **MySQL** | `quanly_lichhoc` (Tên Database yêu cầu) |
| **Frontend** | **HTML5, CSS3, JavaScript** | Fetch API, DOM Manipulation, Modal logic |

---

## 📁 Cấu trúc Thư mục
```
DatLichHoc_LopTap/
├─ index.html          <-- Giao diện Frontend (HTML)
├─ style.css           <-- Định kiểu giao diện (CSS)
└─ backend/
└─ server.js       <-- Lõi API Backend (Node.js/Express)
```
---

## ▶️ Hướng dẫn Khởi chạy (Full-Stack)

Để chạy và sử dụng module này, bạn cần thực hiện ba bước chính: **Cấu hình DB**, **Khởi động Backend**, và **Mở Frontend**.

### 1. Cấu hình Database

1.  Đảm bảo **MySQL Server** của bạn đang chạy.
2.  Tạo database với tên bắt buộc là: `quanly_lichhoc`.
3.  (Tùy chọn: Import cấu trúc bảng và dữ liệu mẫu nếu có, chi tiết xem trong tài liệu `docs/database_schema.sql`).

### 2. Khởi động Backend (API Server)

1.  **Mở Terminal** (hoặc PowerShell/Command Prompt).
2.  Di chuyển vào thư mục backend:
    ```bash
    cd GymManagementSystem\DatLichHoc_LopTap\backend
    ```
3.  **Cài đặt các gói phụ thuộc** (Dependencies):
    ```bash
    npm install
    # Hoặc cài đặt thủ công nếu npm install bị lỗi:
    # npm install express mysql2 cors body-parser exceljs
    ```
4.  **Chạy Server:**
    ```bash
    node server.js
    ```
    * **Kiểm tra:** Server phải hiển thị thông báo: **🚀 Server chạy tại http://localhost:5000**

### 3. Mở Frontend (Giao diện người dùng)

1.  Truy cập thư mục `DatLichHoc_LopTap`.
2.  **Mở file `index.html`** bằng một trong các cách sau:
    * Click đúp vào file `index.html`.
    * Sử dụng Extension **Live Server** trong VS Code.
3.  **Hoàn thành:** Giao diện Frontend sẽ tự động gọi API từ cổng **5000** để tải danh sách lớp tập và các dữ liệu liên quan.

---

## 📝 Giấy phép (License)

* Sản phẩm này được phát triển cho mục đích học tập và quản lý nội bộ. (Cần bổ sung thông tin License chi tiết nếu có).
