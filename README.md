# 🏋️‍♂️ Sport Shop Backend — RESTful API for Sport E-Commerce Platform

**Sport Shop Backend** là hệ thống máy chủ được xây dựng bằng **Node.js**, **Express.js**, sử dụng **MongoDB** để lưu trữ dữ liệu sản phẩm, người dùng và đơn hàng. Dự án cung cấp các endpoint RESTful, hỗ trợ xác thực, phân quyền, kiểm tra dữ liệu đầu vào và xử lý lỗi — là nền tảng cho một ứng dụng bán hàng thể thao hiện đại.

---

## 🚀 Tính Năng Chính

- 🧑‍💼 Đăng ký, đăng nhập, xác thực người dùng (JWT)
- 🔐 Middleware kiểm tra quyền truy cập (admin / người dùng)
- 📦 CRUD sản phẩm: tạo, đọc, cập nhật, xoá
- 🛒 Xử lý đơn hàng cơ bản
- ✅ Validation đầu vào với middleware
- 📂 Cấu trúc code rõ ràng, tách biệt logic controller / middleware / routes
- 🌐 Hỗ trợ CORS, cấu hình bảo mật với `.env`

---

## 🛠️ Tech Stack

| Category              | Stack                                       |
|-----------------------|---------------------------------------------|
| 🧠 Runtime            | Node.js                                     |
| 🌐 Web Framework      | Express.js                                  |
| 🗃️ Database           | MongoDB (Cloud hoặc Local)                  |
| 🔗 ODM                | Mongoose                                    |
| 🛡️ Auth               | JWT (JSON Web Tokens)                       |
| 🔍 Validation         | Custom middleware validations               |
| 🧰 Utils              | Helper functions, Error handlers            |
| 🌍 Config             | dotenv, cors, express.json()                |
| 📦 Package Manager    | npm                                         |

---
## 📦 Cài Đặt & Chạy Server

```bash
# Clone repo
git clone https://github.com/Wiken2k3/Sport-Shop-Backend.git
cd Sport-Shop-Backend

# Cài dependencies
npm install

# Tạo file .env
touch .env
# => thêm biến môi trường theo hướng dẫn bên trên

# Chạy server (chế độ dev)
npm run dev
