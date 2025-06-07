const express = require("express");
const Product = require("../models/Product.model");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");
const { upload } = require("../utils/cloudinary");

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Tạo sản phẩm mới (Admin)
 * @access  Private/Admin
 */
router.post("/", verifyToken, verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.file?.path || req.body.image || "",
    };

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: "Không thể tạo sản phẩm", error: err.message });
  }
});

/**
 * @route   GET /api/products/sale
 * @desc    Lấy tất cả sản phẩm đang giảm giá
 * @access  Public
 */
router.get("/sale", async (req, res) => {
  try {
    const allProducts = await Product.find({});

    // Lọc sản phẩm đang giảm giá (discount > 0 hoặc onSale === true hoặc salePrice < price)
    const saleProducts = allProducts.filter((p) => {
      const hasDiscount = Number(p.discount) > 0;
      const isOnSale = p.onSale === true;
      const hasSalePrice = p.salePrice && p.salePrice < p.price;
      return hasDiscount || isOnSale || hasSalePrice;
    });

    res.status(200).json(saleProducts);
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm sale:", err.message);
    res.status(500).json({
      message: "Không thể lấy sản phẩm khuyến mãi",
      error: err.message,
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật sản phẩm (Admin)
 * @access  Private/Admin
 */
router.put("/:id", verifyToken, verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file?.path) {
      updateData.image = req.file.path;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: "Cập nhật thất bại", error: err.message });
  }
});

/**
 * @route   GET /api/products
 * @desc    Lấy tất cả sản phẩm
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy sản phẩm", error: err.message });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Lấy 1 sản phẩm theo ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy sản phẩm", error: err.message });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Xóa sản phẩm (Admin)
 * @access  Private/Admin
 */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.status(200).json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: "Xóa thất bại", error: err.message });
  }
});

module.exports = router;
