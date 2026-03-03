import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "category"
        }
    ],
    parent : {
        type : mongoose.Schema.ObjectId,
        ref : "subCategory",
        default : null
    }
},{
    timestamps : true
})

const SubCategoryModel = mongoose.model('subCategory',subCategorySchema)

export default SubCategoryModel