import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe, getAdminOrders, updateOrderStatus, getAdminOrderStats, RazorpayOrderController, VerifyPaymentController, assignDeliveryBoy } from '../controllers/order.controller.js'

const orderRouter = Router()

/**
 * @swagger
 * /api/order/cash-on-delivery:
 *   post:
 *     summary: Create COD order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created
 */
orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get("/admin-orders", auth, admin, getAdminOrders)
orderRouter.put("/update-status/:id", auth, admin, updateOrderStatus)
orderRouter.put("/assign-delivery-boy/:id", auth, admin, assignDeliveryBoy)
orderRouter.get("/admin-stats", auth, admin, getAdminOrderStats)
orderRouter.post("/razorpay-order", auth, RazorpayOrderController)
orderRouter.post("/verify-payment", auth, VerifyPaymentController)

export default orderRouter

