# 🚀 Fullstack Project -- Node.js (Backend) & React (Frontend)

Dự án gồm 2 phần:

-   **Backend**: Node.js + Express + MongoDB\
-   **Frontend**: React

------------------------------------------------------------------------

## 📌 1. Yêu cầu hệ thống

-   Node.js \>= 18\
-   npm hoặc yarn\
-   MongoDB (Local hoặc MongoDB Atlas)

------------------------------------------------------------------------

# 🖥 Backend -- Node.js + MongoDB

## 2. Cài đặt Backend

``` bash
cd backend
npm install
```

------------------------------------------------------------------------

## 🔐 3. Tạo file `.env` cho Backend

Tạo file:

    backend/.env

Với nội dung:

``` env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
```

Tạo file mẫu để push lên Git:

    backend/.env.example

Nội dung:

``` env
PORT=
MONGO_URI=
```

------------------------------------------------------------------------

## ▶ 4. Chạy Backend

``` bash
npm run dev
```

------------------------------------------------------------------------

# 🎨 Frontend -- React

## 5. Cài đặt Frontend

``` bash
cd frontend
npm install
```

------------------------------------------------------------------------

## 🔐 6. Tạo file `.env` cho Frontend

Tạo file:

    frontend/.env

Nội dung:

``` env
REACT_APP_API_URL=http://localhost:3001/api
```

Tạo file mẫu:

    frontend/.env.example

Nội dung:

``` env
REACT_APP_API_URL=
```

------------------------------------------------------------------------

## ▶ 7. Chạy Frontend

``` bash
npm run dev
```

------------------------------------------------------------------------

# 🔗 8. Kết nối Frontend ↔ Backend

Trong React:

``` javascript
axios.get(`${process.env.REACT_APP_API_URL}/members`);
```

------------------------------------------------------------------------

# 📂 9. Cấu trúc thư mục đề xuất

    project/
    │
    ├── backend/
    │   ├── src/
    │   ├── .env
    │   ├── .env.example
    │   └── package.json
    │
    └── frontend/
        ├── src/
        ├── .env
        └── package.json

------------------------------------------------------------------------

# ✔ 10. Cách chạy toàn project

**Chạy Backend:**

``` bash
cd backend
npm run dev
```

**Chạy Frontend:**

``` bash
cd frontend
npm run dev
```
