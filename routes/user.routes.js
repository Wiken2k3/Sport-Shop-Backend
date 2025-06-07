const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middlewares/verifyToken");

/**
 * @desc    Lấy thông tin profile người dùng
 * @route   GET /api/users/profile
 * @access  Private
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy thông tin người dùng", error: err.message });
  }
});

/**
 * @desc    Admin: Lấy danh sách tất cả người dùng
 * @route   GET /api/users
 * @access  Private/Admin
 */
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Không thể tải danh sách người dùng", error: err.message });
  }
});

/**
 * @desc    Admin: Cập nhật thông tin user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật", error: err.message });
  }
});

/**
 * @desc    Admin: Xóa người dùng
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
    res.status(200).json({ message: "Đã xóa người dùng." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa", error: err.message });
  }
});

module.exports = router;
