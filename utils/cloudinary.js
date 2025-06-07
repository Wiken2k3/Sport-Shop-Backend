const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config(); // Đảm bảo đọc .env

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer Storage để upload lên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sportshop-products',      // Folder lưu ảnh trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // Có thể thêm transformation nếu cần như resize, crop...
  },
});

// Tạo middleware upload
const upload = multer({ storage });

module.exports = { cloudinary, upload };
