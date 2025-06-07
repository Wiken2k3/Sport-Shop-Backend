const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number, // % giảm giá (0–100)
      default: 0,
      min: 0,
      max: 100,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

// (Optional) Middleware tự động cập nhật onSale
productSchema.pre("save", function (next) {
  this.onSale = this.salePrice > 0 && this.salePrice < this.price;
  next();
});

module.exports = mongoose.model("Product", productSchema);
