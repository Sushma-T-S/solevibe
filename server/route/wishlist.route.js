import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist, checkWishlistStatus } from '../controllers/wishlist.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     summary: Add to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Added to wishlist
 */
router.post('/add', addToWishlist);
router.post('/get', getWishlist);
router.post('/remove', removeFromWishlist);
router.post('/check', checkWishlistStatus);

export default router;
