const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { verifyToken } = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// Hàm tạo token
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin, // ✅ bổ sung vào token
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "3d" }
  );
};

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email đã tồn tại." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const token = createToken(savedUser);

    res.status(201).json({
      message: "Đăng ký thành công!",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
      },
    });
  } catch (err) {
    console.error("Đăng ký lỗi:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng." });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi đăng nhập.", error: err.message });
  }
});

// ✅ LẤY THÔNG TIN NGƯỜI DÙNG
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy thông tin user." });
  }
});

// ✅ TEST ADMIN ONLY
router.get("/admin-only", verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: `Chào admin ${req.user.email}!` });
});

module.exports = router;
