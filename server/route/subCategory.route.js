import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, getSubCategoryByCategoryController, updateSubCategoryController } from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,AddSubCategoryController)
subCategoryRouter.post('/get',getSubCategoryController)
subCategoryRouter.get('/get-by-category/:categoryId',getSubCategoryByCategoryController)
subCategoryRouter.put('/update',auth,updateSubCategoryController)
subCategoryRouter.delete('/delete',auth,deleteSubCategoryController)

export default subCategoryRouter
