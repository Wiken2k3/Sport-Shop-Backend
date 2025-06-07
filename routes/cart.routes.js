const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product.model");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

// @desc    Thêm sản phẩm vào giỏ hàng
// @route   POST /api/cart
// @access  Private
router.post("/", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity <= 0) {
    return res.status(400).json({ message: "Thiếu sản phẩm hoặc số lượng không hợp lệ" });
  }

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    // Nếu chưa có giỏ thì tạo mới
    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        products: [{ productId, quantity }],
      });
    } else {
      // Nếu có rồi, kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
      const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    const savedCart = await cart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi thêm vào giỏ hàng", error: err.message });
  }
});

// @desc    Lấy giỏ hàng của user
// @route   GET /api/cart/:userId
// @access  Private
router.get("/:userId", verifyToken, async (req, res) => {
  if (req.user.id !== req.params.userId && !req.user.isAdmin) {
    return res.status(403).json({ message: "Bạn không có quyền truy cập giỏ hàng này." });
  }

  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId", "title price");
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng." });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng." });
  }
});

// @desc    Xóa sản phẩm khỏi giỏ hàng
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng." });
    }

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== req.params.productId
    );

    const updatedCart = await cart.save();
    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm khỏi giỏ hàng." });
  }
});

module.exports = router;
