const connectDB = require('./config/connectDB');
const OrderModel = require('./models/order.model');
const UserModel = require('./models/user.model');
const AddressModel = require('./models/address.model');

async function checkChetan() {
  await connectDB();
  console.log('Connected to DB');

  // Find orders with Chetan in address name
  const orders = await OrderModel.find({
    'delivery_address.name': /Chetan/i
  }).populate('userId', 'name email mobile')
    .populate('delivery_address', 'name mobile address_line city pincode')
    .lean();

  console.log('\\n=== CHEATAN ORDERS ===');
  orders.forEach((o, i) => {
    console.log(`Order ${i+1}: ID ${o._id}`);
    console.log('  Customer name:', o.userId?.name);
    console.log('  User mobile:', o.userId?.mobile);
    console.log('  Address name:', o.delivery_address?.name);
    console.log('  Address mobile:', o.delivery_address?.mobile);
    console.log('  OrderId:', o.orderId);
    console.log('');
  });

  // Find Chetan users
  const users = await UserModel.find({
    name: /Chetan/i
  }).lean();
  console.log('\\n=== CHEATAN USERS ===');
  users.forEach(u => {
    console.log(`User: ${u.name}, mobile: ${u.mobile}, _id: ${u._id}`);
  });

  // Find Chetan addresses
  const addresses = await AddressModel.find({
    name: /Chetan/i
  }).lean();
  console.log('\\n=== CHEATAN ADDRESSES ===');
  addresses.forEach(a => {
    console.log(`Address: ${a.name}, mobile: ${a.mobile}, _id: ${a._id}`);
  });

  process.exit(0);
}

checkChetan().catch(console.error);

