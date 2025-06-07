const dotenv = require("dotenv");
dotenv.config(); // <== Load biến môi trường từ .env

const connectDB = require("./config/db");
const app = require("./app");



// Kết nối MongoDB
connectDB();

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
