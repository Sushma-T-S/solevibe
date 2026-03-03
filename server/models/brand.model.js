import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

const BrandModel = mongoose.model('brand',brandSchema)

export default BrandModel
