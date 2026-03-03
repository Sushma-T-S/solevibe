const mongoose = require("mongoose");

const sizeStockSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
});

const colorVariantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  sizes: [sizeStockSchema],
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },

    images: [
      {
        type: String,
      },
    ],

    variants: [colorVariantSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
