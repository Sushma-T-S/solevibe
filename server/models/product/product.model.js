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

    // Brand
    brand: { type: mongoose.Schema.ObjectId, ref: "brand", default: null },

    unit: { type: String, default: "pair", trim: true },
    stock: { type: Number, default: 0, min: 0 },

    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },

    description: { type: String, required: true, trim: true },

    // Search tags for better discoverability (e.g., ["casual", "summer", "running"])
    tags: { type: [String], default: [], index: true },

    // Flexible attributes: gender, colors, size notes, etc.
    more_details: { type: Object, default: {} },

    // Optional production-level inventory (color → sizes → stock)
    variants: { type: [variantSchema], default: [] },

    // RATINGS SYSTEM
    reviews: [{
      userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
      orderId: { type: mongoose.Schema.ObjectId, ref: 'order', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, trim: true },
      createdAt: { type: Date, default: Date.now }
    }],
    avgRating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Text index for search + reviews
productSchema.index({
    name: "text",
    description: 'text',
    tags: 'text',
    'reviews.comment': 'text'
}, {
    weights: {
        name: 10,
        tags: 8,
        description: 5,
        'reviews.comment': 3
    }
});

// Index for ratings queries
productSchema.index({ avgRating: -1 });
productSchema.index({ totalReviews: -1 });
productSchema.index({ 'reviews.userId': 1 });
productSchema.index({ 'reviews.orderId': 1 });

// Compound indexes for better query performance
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ brand: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ discount: 1 });

// Index for filtering and sorting
productSchema.index({ isActive: 1, category: 1 });
productSchema.index({ stock: 1 });

// Index for price range queries
productSchema.index({ price: 1, discount: -1 });

productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    const ratings = this.reviews.map(r => r.rating);
    this.avgRating = ratings.length > 0 ? 
      parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 0;
    this.totalReviews = this.reviews.length;
  }
  next();
});

// Indexes already defined - removed duplicates to fix warning

const ProductModel = mongoose.model('product', productSchema)

export default ProductModel

