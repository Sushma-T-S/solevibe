import mongoose from "mongoose";

const sizeStockSchema = new mongoose.Schema(
  {
    size: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true, trim: true },
    images: [{ type: String, trim: true }],
    sizes: [sizeStockSchema],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // Images used across storefront/admin UI
    image: [{ type: String, trim: true }],

    // Real app uses category + subCategory collections
    category: [{ type: mongoose.Schema.ObjectId, ref: "category" }],
    subCategory: [{ type: mongoose.Schema.ObjectId, ref: "subCategory" }],

    unit: { type: String, default: "pair", trim: true },
    stock: { type: Number, default: 0, min: 0 },

    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },

    description: { type: String, required: true, trim: true },

    // Flexible attributes: brand, gender, colors, size notes, etc.
    more_details: { type: Object, default: {} },

    // Optional production-level inventory (color → sizes → stock)
    variants: { type: [variantSchema], default: [] },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

//create a text index
productSchema.index({
    name  : "text",
    description : 'text'
},{
    name : 10,
    description : 5
})


const ProductModel = mongoose.model('product',productSchema)

export default ProductModel