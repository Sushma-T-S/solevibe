import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import {
  adminAllOrdersController,
  adminAllUsersController,
  adminDashboardStatsController,
  adminLowStockProductsController,
  adminUpdateOrderStatusController,
  adminUpdateUserRoleController,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/dashboard/stats", auth, admin, adminDashboardStatsController);
adminRouter.get("/orders/all", auth, admin, adminAllOrdersController);
adminRouter.put("/orders/update-status", auth, admin, adminUpdateOrderStatusController);
adminRouter.get("/users/all", auth, admin, adminAllUsersController);
adminRouter.put("/users/update-role", auth, admin, adminUpdateUserRoleController);
adminRouter.get("/products/low-stock", auth, admin, adminLowStockProductsController);

export default adminRouter;

