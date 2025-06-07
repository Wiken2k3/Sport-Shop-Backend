const User = require("../models/User.model");

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // req.user đã được set từ verifyToken

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền admin." });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Lỗi xác thực quyền admin.", error: err.message });
  }
};

module.exports = verifyAdmin;
