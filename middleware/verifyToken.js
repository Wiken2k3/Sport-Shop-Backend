const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/**
 * @desc    Middleware xác thực JWT Token
 * @access  Private (gắn req.user sau khi xác thực)
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("❌ Không có token hoặc sai định dạng.");
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    req.user = user; // Gắn user đã xác thực (trừ mật khẩu)
    next();
  } catch (err) {
    console.error("❌ Token không hợp lệ hoặc đã hết hạn:", err.message);
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

/**
 * @desc    Middleware xác thực quyền Admin
 * @access  Private/Admin
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Bạn không có quyền admin." });
  }
  next();
};

/**
 * @desc    Middleware xác thực chính người dùng hoặc admin
 * @access  Private
 */
const verifyUserOrAdmin = (req, res, next) => {
  const targetUserId = req.params.userId || req.body.userId;

  if (!targetUserId) {
    return res.status(400).json({ message: "Thiếu userId trong yêu cầu." });
  }

  if (req.user._id.toString() === targetUserId || req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({ message: "Bạn không có quyền truy cập tài nguyên này." });
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUserOrAdmin,
};
