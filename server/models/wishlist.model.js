import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'product',
        required: true
    }
}, {
    timestamps: true
});

// Prevent duplicate entries for same user and product
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const WishlistModel = mongoose.model('wishlist', wishlistSchema);

export default WishlistModel;
