import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

export const adminDashboardStatsController = async (req, res) => {
  try {
    const [users, orders, products] = await Promise.all([
      UserModel.countDocuments({}),
      OrderModel.countDocuments({}),
      ProductModel.countDocuments({}),
    ]);

    const revenueAgg = await OrderModel.aggregate([
      { $match: { payment_status: { $in: ["paid", "CASH ON DELIVERY"] } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmt" } } },
    ]);

    const revenue = revenueAgg?.[0]?.revenue || 0;

    return res.json({
      message: "Admin dashboard stats",
      success: true,
      error: false,
      data: { users, orders, products, revenue },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const adminAllOrdersController = async (req, res) => {
  try {
    const data = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("userId", "name email mobile role");

    return res.json({
      message: "All orders",
      success: true,
      error: false,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const adminUpdateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "orderId and status are required",
        success: false,
        error: true,
      });
    }

    const updated = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Order status updated",
      success: true,
      error: false,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const adminAllUsersController = async (req, res) => {
  try {
    const data = await UserModel.find({}, { password: 0, refresh_token: 0 })
      .sort({ createdAt: -1 });

    return res.json({
      message: "All users",
      success: true,
      error: false,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const adminUpdateUserRoleController = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        message: "userId and role are required",
        success: false,
        error: true,
      });
    }

    const updated = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true, projection: { password: 0, refresh_token: 0 } }
    );

    if (!updated) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "User role updated",
      success: true,
      error: false,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const adminLowStockProductsController = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const data = await ProductModel.find({ stock: { $lte: threshold } })
      .sort({ stock: 1, updatedAt: -1 })
      .limit(100);

    return res.json({
      message: "Low stock products",
      success: true,
      error: false,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

