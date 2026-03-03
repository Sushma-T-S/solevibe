import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist, checkWishlistStatus } from '../controllers/wishlist.controller.js';

const router = express.Router();

router.post('/add', addToWishlist);
router.post('/get', getWishlist);
router.post('/remove', removeFromWishlist);
router.post('/check', checkWishlistStatus);

export default router;
