import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product'
    },
    quantity : {
        type : Number,
        default : 1
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    color: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: null
    }
},{
    timestamps : true
})

const CartProductModel = mongoose.model('cartProduct',cartProductSchema)

export default CartProductModel
