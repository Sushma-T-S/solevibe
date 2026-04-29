import Stripe from "../config/stripe.js";
import mongoose from "mongoose";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import DeliveryBoyModel from "../models/deliveryBoy.model.js";
import generateOrderId from "../utils/generateOrderId.js";
import { admin } from "../middleware/Admin.js";
import RazorpayInstance from "../config/razorpay.js";
import crypto from "crypto";

export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body 

        // NEW: Single orderGroupId for entire checkout
        const orderGroupId = generateOrderId(); 

        // NEW: Build items array from cart
        const items = list_items.map(el => ({
            productId: el.productId._id, 
            name: el.productId.name,
            image: el.productId.image,
            size: el.size || null,
            quantity: el.quantity || 1,
            singlePrice: el.productId.price,  // snapshot price
            subTotal: (el.productId.price || 0) * (el.quantity || 1)
        }));

        // Backward compat: use first item for deprecated fields
        const firstItem = list_items[0];
        const payload = {
            userId: userId,
            orderGroupId,
            orderId: orderGroupId,  // reuse for main orderId
            productId: firstItem.productId._id,
            product_details: {
                name: firstItem.productId.name,
                image: firstItem.productId.image,
                size: firstItem.size || null
            },
            items,  // NEW: all items
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            status: "confirmed",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt || items.reduce((sum, i) => sum + i.subTotal, 0),
            totalAmt: totalAmt || items.reduce((sum, i) => sum + i.subTotal, 0),
        };

        const generatedOrder = await OrderModel.create(payload);

        // Clear cart
        await CartProductModel.deleteMany({ userId });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        return response.json({
            message: "Order successfully created (1 order with multiple items)",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// NEW: Updated for single order with items
const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const items = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            items.push({
                productId: product.metadata.productId, 
                name: product.name,
                image: product.images,
                size: null,  
                quantity: item.quantity,
                singlePrice: Number(item.amount_total / 100 / item.quantity),
                subTotal: Number(item.amount_total / 100)
            });
        }
    }

    return items;
}

// Updated webhook for SINGLE order
export async function webhookStripe(request,response){
    const event = request.body;

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const items = await getOrderProductItems({
        lineItems,
        userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });
    
      const orderGroupId = generateOrderId();
      const firstItem = items[0];
      
      const orderData = {
        userId,
        orderGroupId,
        orderId: orderGroupId,
        productId: firstItem.productId,
        product_details: {
            name: firstItem.name,
            image: firstItem.image,
            size: firstItem.size
        },
        items,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
        status: "confirmed",
        delivery_address: session.metadata.addressId,
        totalAmt: items.reduce((sum, i) => sum + i.subTotal, 0),
        subTotalAmt: items.reduce((sum, i) => sum + i.subTotal, 0),
      };

      const order = await OrderModel.create(orderData);

      if(order){
        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
        await CartProductModel.deleteMany({ userId });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({received: true});
}

export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId
        
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return response.status(401).json({
                message: "Invalid or missing user ID",
                error: true,
                success: false
            });
        }

// SIMPLIFIED: Return flat orders with populated products for images
        const orders = await OrderModel.find({ userId: new mongoose.Types.ObjectId(userId) })
.populate('items.productId', 'image name price')
            .populate('delivery_address', 'name address_line city state pincode mobile country')
            .populate('userId', 'name mobile')
            .sort({ createdAt: -1 })
            .lean();

        // Group by orderGroupId client-side for display
        const grouped = orders.reduce((acc, order) => {
            if (!acc[order.orderGroupId]) {
                acc[order.orderGroupId] = order;
            }
            return acc;
        }, {});

        const groupedArray = Object.values(grouped);

        return response.json({
            message: "Orders with populated product images & addresses",
            data: groupedArray,
            error: false,
            success: true
        });

        return response.json({
            message: "Grouped orders with populated product images & fixed address",
            data: groupedOrders,
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Order fetch error:', error);
        return response.status(500).json({
            message: error.message || "Failed to fetch orders",
            error: true,
            success: false
        });
    }
}

export async function getAdminOrders(request, response) {
  const startTime = Date.now();
  console.log(`[ADMIN ORDERS] Query params: page=${request.query.page}, limit=${request.query.limit}, filter=${request.query.filter}, search=${request.query.search?'yes':'no'} (${request.query.search?.length||0} chars)`);
  
  try {
    const { page = 1, limit = 15, filter = 'all', search, fromDate, toDate } = request.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const intLimit = parseInt(limit);

    let match = {};
    if (filter !== 'all') {
      match.status = filter;
    }
    if (search) {
      match.$or = [
        { orderId: { $regex: search, $options: 'i' } }
      ];
      // Skip items.name search for performance/empty arrays
    }
    if (fromDate) {
      match.createdAt = match.createdAt || {};
      match.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      match.createdAt = match.createdAt || {};
      match.createdAt.$lte = new Date(toDate + 'T23:59:59.999Z');
    }

    console.log('[ADMIN ORDERS] Match query:', JSON.stringify(match, null, 2));

    const queryTime = performance.now();
    console.time('adminOrders-find');
    const orders = await OrderModel.find(match).select('orderId status payment_status paymentId totalAmt subTotalAmt createdAt userId delivery_address items.productId tracking deliveryBoyId')
      .populate('userId', 'name email mobile')
      .populate('delivery_address', 'name mobile address_line city state pincode country')
      .populate('deliveryBoyId', 'name email phone location')
      .populate({
        path: 'items.productId',
        select: 'name image brand more_details variants',
        populate: { path: 'brand', select: 'name' }
      })
      .populate({
        path: 'productId',
        select: 'name image brand more_details variants',
        populate: { path: 'brand', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(intLimit)
      .lean();
console.timeEnd('adminOrders-find');

  // DEBUG IMAGE LOGGING
  if (orders.length > 0) {
    const firstOrder = orders[0];
    console.log('[DEBUG ORDERS IMAGES] First order items length:', firstOrder.items?.length);
    if (firstOrder.items?.length > 0) {
      console.log('[DEBUG] First item image:', firstOrder.items[0].image);
      console.log('[DEBUG] First item productId.image:', firstOrder.items[0].productId?.image);
    }
    console.log('[DEBUG] product_details.image:', firstOrder.product_details?.image);
  }

console.log(`[ADMIN ORDERS] Found ${orders.length} orders`);

    const countTime = performance.now();
    console.time('adminOrders-count');
    const total = await OrderModel.countDocuments(match);
    console.timeEnd('adminOrders-count');

    const totalTime = Date.now() - startTime;
console.log(`[ADMIN ORDERS] Total time: ${totalTime}ms (query:${Math.round(queryTime)}ms, orders:${orders.length}, total:${total})`);

    return response.json({
      message: 'Admin orders fetched successfully',
      data: { orders, total },
      error: false,
      success: true
    });
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[ADMIN ORDERS ERROR ${totalTime}ms]:`, error.message);
    console.error('Stack:', error.stack);
    return response.status(500).json({
      message: `Query failed: ${error.message}`,
      error: true,
      success: false
    });
  }
}

// Rest unchanged...
export async function updateOrderStatus(request, response) {
    try {
        const { id } = request.params;
        const { status, note = '' } = request.body;

        if (!['pending','confirmed','packed','shipped','out-for-delivery','delivered','cancelled'].includes(status)) {
            return response.status(400).json({
                message: 'Invalid status',
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findById(id);
        if (!order) {
            return response.status(404).json({
                message: 'Order not found',
                error: true,
                success: false
            });
        }

        order.tracking.push({
            status,
            timestamp: new Date(),
            note
        });
        order.status = status;

        await order.save();

        const populatedOrder = await OrderModel.findById(id)
            .populate('delivery_address', 'address_line city state pincode country mobile name')
            .populate('items.productId', 'name price image')
            .populate('deliveryBoyId', 'name email phone location')
            .lean();

        return response.json({
            message: 'Order status updated',
            data: populatedOrder,
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Update status error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
}

export async function assignDeliveryBoy(request, response) {
    try {
        const { id } = request.params;
        const { deliveryBoyId } = request.body;

        if (!deliveryBoyId) {
            return response.status(400).json({
                message: 'Provide deliveryBoyId',
                error: true,
                success: false
            });
        }

        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);
        if (!deliveryBoy) {
            return response.status(404).json({
                message: 'Delivery boy not found',
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findByIdAndUpdate(
            id,
            { deliveryBoyId },
            { new: true }
        )
            .populate('delivery_address', 'address_line city state pincode country mobile name')
            .populate('items.productId', 'name price image')
            .populate('deliveryBoyId', 'name email phone location')
            .lean();

        if (!order) {
            return response.status(404).json({
                message: 'Order not found',
                error: true,
                success: false
            });
        }

        return response.json({
            message: 'Delivery boy assigned successfully',
            data: order,
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Assign delivery boy error:', error);
        return response.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
}

export async function getAdminOrderStats(request, response) {
  const startTime = Date.now();
  console.log('[ADMIN STATS] Fetching order stats...');
  
  try {
    // Use aggregate for consistent total unique groups
    const statsResult = await OrderModel.aggregate([
      // Total unique order groups
      { $group: { _id: '$orderGroupId', count: { $sum: 1 } } },
      { $group: { _id: null, totalOrders: { $sum: 1 } } }
    ]);
    const totalOrders = statsResult[0]?.totalOrders || 0;

    const statusCounts = await OrderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const statsMap = {};
    statusCounts.forEach(stat => {
      statsMap[stat._id] = stat.count;
    });

    const stats = {
      total: totalOrders,
      pending: statsMap.pending || 0,
      confirmed: statsMap.confirmed || 0,
      packed: statsMap.packed || 0,
      shipped: statsMap.shipped || 0,
      'out-for-delivery': statsMap['out-for-delivery'] || 0,
      delivered: statsMap.delivered || 0,
      cancelled: statsMap.cancelled || 0
    };

    const totalTime = Date.now() - startTime;
    console.log(`[ADMIN STATS] Success: total=${totalOrders}, time=${totalTime}ms`);

    return response.json({
      message: 'Order statistics',
      data: stats,
      error: false,
      success: true
    });
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[ADMIN STATS ERROR ${totalTime}ms]:`, error.message);
    console.error('Stack:', error.stack);
    return response.status(500).json({
      message: `Stats error: ${error.message}`,
      error: true,
      success: false
    });
  }
}

export async function RazorpayOrderController(request, response) {
    try {
        const userId = request.userId;
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        const options = {
            amount: Math.round(totalAmt * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId,
                addressId
            }
        };

        const order = await RazorpayInstance.orders.create(options);

        return response.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: RazorpayInstance.key_id,
            notes: order.notes
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return response.status(500).json({
            success: false,
            message: error.message || 'Failed to create Razorpay order'
        });
    }
}

export async function VerifyPaymentController(request, response) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, addressId, list_items, totalAmt, subTotalAmt } = request.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return response.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        const userId = request.userId;
        const orderGroupId = generateOrderId();

        // NEW: Build items array
        const items = list_items.map(el => ({
            productId: el.productId._id,
            name: el.productId.name,
            image: el.productId.image,
            size: el.size || null,
            quantity: el.quantity || 1,
            singlePrice: el.productId.price,
            subTotal: el.productId.price * (el.quantity || 1)
        }));

        const firstItem = list_items[0];
        const orderData = {
            userId,
            orderGroupId,
            orderId: orderGroupId,
            productId: firstItem.productId._id,
            product_details: {
                name: firstItem.productId.name,
                image: firstItem.productId.image,
                size: firstItem.size || null
            },
            items,
            paymentId: razorpay_payment_id,
            payment_status: "PAID ONLINE",
            status: "confirmed",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt || items.reduce((sum, i) => sum + i.subTotal, 0),
            totalAmt: totalAmt || items.reduce((sum, i) => sum + i.subTotal, 0),
        };

        const generatedOrder = await OrderModel.create(orderData);

        // Clear cart
        await CartProductModel.deleteMany({ userId });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        return response.json({
            message: "Payment verified & single order created",
            success: true,
            data: generatedOrder
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return response.status(500).json({
            success: false,
            message: error.message || 'Payment verification failed'
        });
    }
}

