import WishlistModel from "../models/wishlist.model.js";
import ProductModel from "../models/product.model.js";

export const addToWishlist = async (request, response) => {
    try {
        const { userId, productId } = request.body;

        if (!userId || !productId) {
            return response.status(400).json({
                message: "User ID and Product ID are required",
                error: true,
                success: false
            });
        }

        // Check if already in wishlist
        const existingItem = await WishlistModel.findOne({
            userId: userId,
            productId: productId
        });

        if (existingItem) {
            // Remove from wishlist (toggle)
            await WishlistModel.deleteOne({ _id: existingItem._id });
            return response.json({
                message: "Removed from wishlist",
                error: false,
                success: true,
                isInWishlist: false
            });
        }

        // Add to wishlist
        const wishlistItem = new WishlistModel({
            userId: userId,
            productId: productId
        });

        await wishlistItem.save();

        return response.json({
            message: "Added to wishlist",
            error: false,
            success: true,
            isInWishlist: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getWishlist = async (request, response) => {
    try {
        const { userId } = request.body;

        if (!userId) {
            return response.status(400).json({
                message: "User ID is required",
                error: true,
                success: false
            });
        }

        const wishlistItems = await WishlistModel.find({ userId: userId })
            .populate('productId')
            .sort({ createdAt: -1 });

        return response.json({
            message: "Wishlist items",
            error: false,
            success: true,
            data: wishlistItems
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const removeFromWishlist = async (request, response) => {
    try {
        const { userId, productId } = request.body;

        if (!userId || !productId) {
            return response.status(400).json({
                message: "User ID and Product ID are required",
                error: true,
                success: false
            });
        }

        await WishlistModel.deleteOne({
            userId: userId,
            productId: productId
        });

        return response.json({
            message: "Removed from wishlist",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const checkWishlistStatus = async (request, response) => {
    try {
        const { userId, productId } = request.body;

        if (!userId || !productId) {
            return response.status(400).json({
                message: "User ID and Product ID are required",
                error: true,
                success: false
            });
        }

        const existingItem = await WishlistModel.findOne({
            userId: userId,
            productId: productId
        });

        return response.json({
            message: "Wishlist status",
            error: false,
            success: true,
            isInWishlist: !!existingItem
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
