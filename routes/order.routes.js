const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

/**
 * @desc    Tạo đơn hàng mới
 * @route   POST /api/orders
 * @access  Private
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { products, amount, address } = req.body;
    if (!products || !amount || !address) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng." });
    }

    const order = new Order({
      user: req.user.id,
      products,
      amount,
      address,
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  }
});

/**
 * @desc    Lấy đơn hàng của người dùng
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng", error: err.message });
  }
});

/**
 * @desc    Admin: Lấy toàn bộ đơn hàng
 * @route   GET /api/orders
 * @access  Private/Admin
 */
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải đơn hàng", error: err.message });
  }
});

/**
 * @desc    Admin: Lấy đơn hàng theo userId
 * @route   GET /api/orders/user/:userId
 * @access  Private/Admin or User chính mình
 */
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Không có quyền." });
    }

    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi", error: err.message });
  }
});

/**
 * @desc    Admin: Cập nhật trạng thái đơn hàng
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật đơn", error: err.message });
  }
});

/**
 * @desc    Admin: Xóa đơn hàng
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    res.status(200).json({ message: "Đã xóa đơn hàng." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa đơn", error: err.message });
  }
});

module.exports = router;
