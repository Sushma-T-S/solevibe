import { Router } from 'express'
import auth from '../middleware/auth.js'
import { 
  createProductController, 
  deleteProductDetails, 
  getProductByCategory, 
  getProductByCategoryAndSubCategory, 
  getProductController, 
  getProductDetails, 
  getRelatedProducts, 
  getProductDetailsBulk,
  searchProduct, 
  updateProductDetails,
  addProductReview,
  getProductReviews
} from '../controllers/product.controller.js'
import { admin } from '../middleware/Admin.js'

const productRouter = Router()

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Create product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               # ... other fields
 *     responses:
 *       201:
 *         description: Product created
 */
productRouter.post("/create",auth,admin,createProductController)
/**
 * @swagger
 * /api/product/get:
 *   post:
 *     summary: Get products
 *     tags: [Products]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: number
 *     responses:
 *       200:
 *         description: Products list
 */
productRouter.post('/get',getProductController)
productRouter.post("/get-product-by-category",getProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)
productRouter.post('/get-related-products',getRelatedProducts)

// Review routes
productRouter.post('/add-review', auth, addProductReview)
productRouter.post('/product-reviews', getProductReviews) // public for PDP
productRouter.post('/get-product-details-bulk', getProductDetailsBulk) // for admin orders images


//update product
productRouter.put('/update-product-details',auth,admin,updateProductDetails)

//delete product
productRouter.delete('/delete-product',auth,admin,deleteProductDetails)

//search product 
productRouter.post('/search-product',searchProduct)

export default productRouter
