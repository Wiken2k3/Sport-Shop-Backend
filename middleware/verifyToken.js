const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

    req.user = user;
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
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền admin." });
    }

    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực quyền admin:", err.message);
    res.status(500).json({ message: "Lỗi xác thực quyền admin.", error: err.message });
  }
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
