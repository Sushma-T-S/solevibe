import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },
    email: {
        type: String,
        required: [true, "Provide email"]
    },
    phone: {
        type: String,
        required: [true, "Provide phone number"]
    },
    location: {
        pincode: {
            type: String,
            required: [true, "Provide pincode"]
        },
        state: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        area: {
            type: String,
            default: ""
        }
    },
    password: {
        type: String,
        required: [true, "Provide password"]
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, {
    timestamps: true
});

deliveryBoySchema.index({ email: 1 });
deliveryBoySchema.index({ phone: 1 });
deliveryBoySchema.index({ "location.pincode": 1 });
deliveryBoySchema.index({ status: 1 });
deliveryBoySchema.index({ createdAt: -1 });

const DeliveryBoyModel = mongoose.model("DeliveryBoy", deliveryBoySchema);

export default DeliveryBoyModel;
