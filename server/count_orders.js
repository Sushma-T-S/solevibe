import mongoose from 'mongoose';
import connectDB from './config/connectDB.js';
import OrderModel from './models/order.model.js';

(async () => {
  try {
    await connectDB();
    const totalOrders = await OrderModel.countDocuments();
    const uniqueGroups = await OrderModel.distinct('orderGroupId');
    console.log(`Total orders: ${totalOrders}`);
    console.log(`Unique order groups: ${uniqueGroups.length}`);
    console.log('Sample order IDs:', await OrderModel.find().select('orderId status userId items.productId createdAt').limit(3));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();

