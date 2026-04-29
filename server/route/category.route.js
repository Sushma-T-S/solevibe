import { Router } from 'express'
import auth from '../middleware/auth.js'
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controllers/category.controller.js'

const categoryRouter = Router()

/**
 * @swagger
 * /api/category/add-category:
 *   post:
 *     summary: Add category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created
 */
categoryRouter.post("/add-category",auth,AddCategoryController)
categoryRouter.get('/get',getCategoryController)
categoryRouter.put('/update',auth,updateCategoryController)
categoryRouter.delete("/delete",auth,deleteCategoryController)

export default categoryRouter