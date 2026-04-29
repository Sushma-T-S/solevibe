import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

export const adminDashboardStatsController = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Basic counts
    const [users, totalOrders, products] = await Promise.all([
      UserModel.countDocuments({}),
      OrderModel.countDocuments({}),
      ProductModel.countDocuments({})
    ]);

    // Total revenue
    const revenueAgg = await OrderModel.aggregate([
      { $match: { payment_status: { $nin: [""] } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmt" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.revenue || 0;

    // Daily sales and orders (last 30 days)
    const dailyDataRaw = await OrderModel.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $addFields: { dateStr: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
      { $group: { _id: "$dateStr", sales: { $sum: "$totalAmt" }, orderCount: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    const dailySales = dailyDataRaw.map(d => ({ name: d._id, sales: Math.round(d.sales), orders: d.orderCount }));

    // Status counts
    const statusCountsRaw = await OrderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const statusCounts = {};
    statusCountsRaw.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    // Top 5 products by revenue
    const topProductsRaw = await OrderModel.aggregate([
      { $group: { _id: "$product_details.name", revenue: { $sum: "$totalAmt" }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", revenue: 1, count: 1, _id: 0 } }
    ]);

    // Mock product views data (add real tracking later)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const productViewsData = days.map((day, index) => ({
      day,
      thisWeek: Math.floor((Math.sin(index * 0.8) * 0.3 + 0.7) * 50000 + 5000),
      lastWeek: Math.floor((Math.sin(index * 0.6) * 0.25 + 0.6) * 45000 + 3000)
    }));

    return res.json({
      message: "Admin dashboard stats with charts data",
      success: true,
      error: false,
      data: {
        users,
        orders: totalOrders,
        products,
        revenue: totalRevenue,
        dailySales,  // [{name, sales, orders}]
        statusCounts,  // {pending: x, ...}
        topProducts: topProductsRaw,
        productViewsData
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true
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

