import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    orderGroupId : {
        type : String,
        required : [true, "Provide orderGroupId"],
        index: true
    },
    orderId : {
        type : String,
        required : [true, "Provide orderId"],
    },
    // DEPRECATED - kept for backward compatibility
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : "product"
    },
    product_details : {
        name : String,
        image : Array,
        size : { type: String, default: null }
    },
    // NEW: Multiple items in ONE order
    items: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'product'
        },
        name: String,
        image: [String],
        size: String,
        quantity: {
            type: Number,
            default: 1
        },
        singlePrice: Number,  // price at order time
        subTotal: Number      // singlePrice * quantity
    }],
    paymentId : {
        type : String,
        default : ""
    },
    payment_status : {
        type : String,
        default : ""
    },
    status : {
        type : String,
        enum : ["pending","confirmed","packed","shipped","out-for-delivery","delivered","cancelled"],
        default : "pending"
    },
    tracking : [{
        status : {
            type : String,
            enum : ["pending","confirmed","packed","shipped","out-for-delivery","delivered","cancelled"]
        },
        timestamp : {
            type : Date,
            default : Date.now
        },
        note : {
            type : String,
            default : ""
        }
    }],
    delivery_address : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    deliveryBoyId : {
        type : mongoose.Schema.ObjectId,
        ref : 'DeliveryBoy',
        default : null
    },
    subTotalAmt : {
        type : Number,
        default : 0
    },
    totalAmt : {
        type : Number,
        default : 0
    },
    invoice_receipt : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

// Production indexes
orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ orderGroupId: 1 })  // NEW: Fast grouping
orderSchema.index({ status: 1, createdAt: -1 })
orderSchema.index({ payment_status: 1 })
orderSchema.index({ delivery_address: 1 })
orderSchema.index({ 'tracking.timestamp': -1 })

const OrderModel = mongoose.model('order',orderSchema)

// Auto-push initial tracking
orderSchema.pre('save', function(next) {
  if (this.isNew && this.tracking.length === 0) {
    this.tracking.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  next();
});

export default OrderModel

