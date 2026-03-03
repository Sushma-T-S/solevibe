import ProductModel from "../models/product.model.js";

const normalizeIdArray = (value) => {
    if (!value) return [];
    const arr = Array.isArray(value) ? value : [value];
    return arr
        .map((v) => {
            if (!v) return null;
            if (typeof v === "string") return v;
            if (typeof v === "object" && v._id) return v._id;
            return null;
        })
        .filter(Boolean);
};

const normalizeStringArray = (value) => {
    if (!value) return [];
    const arr = Array.isArray(value) ? value : [value];
    return arr
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter(Boolean);
};

export const createProductController = async(request,response)=>{
    try {
        const {
            name ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
            variants,
            image,
            images, // backward compatibility
        } = request.body

        if(!name || !price || !description){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const imageArr = normalizeStringArray(image?.length ? image : images);
        const categoryIds = normalizeIdArray(category);
        const subCategoryIds = normalizeIdArray(subCategory);

        let parsedVariants = [];
        if (variants) {
            parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
            if (!Array.isArray(parsedVariants)) parsedVariants = [];
        }

        const computedStockFromVariants = parsedVariants.reduce((total, v) => {
            const vSum = (v?.sizes || []).reduce((t, s) => t + (Number(s?.stock) || 0), 0);
            return total + vSum;
        }, 0);

        const product = new ProductModel({
            name ,
            image: imageArr,
            category: categoryIds,
            subCategory: subCategoryIds,
            unit,
            stock: stock ?? computedStockFromVariants,
            price,
            discount,
            description,
            more_details: more_details && typeof more_details === "string" ? JSON.parse(more_details) : (more_details || {}),
            variants: parsedVariants,
        })
        const saveProduct = await product.save()

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductController = async(request,response)=>{
    try {
        
        let { page, limit, search, categories, subCategories, brands, colors, price } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 50
        }

        // Build query
        let query = {}

        // Search by text
        if (search) {
            query.$text = { $search: search }
        }

        // Filter by category (from category collection)
        if (categories && categories.length > 0) {
            query.category = { $in: categories }
        }

        // Filter by subCategory (from subCategory collection)
        if (subCategories && subCategories.length > 0) {
            query.subCategory = { $in: subCategories }
        }

        // Filter by brand
        if (brands && brands.length > 0) {
            query['more_details.brand'] = { $in: brands }
        }

        // Filter by color
        if (colors && colors.length > 0) {
            query['more_details.color'] = { $in: colors }
        }

        // Filter by price
        if (price) {
            query.price = { $lte: parseInt(price) }
        }

        const skip = (page - 1) * limit

        const [data,totalCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.find({ 
            category : { $in : [id] }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { categoryId,subCategoryId,page,limit } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = {
            category : { $in :categoryId  },
            subCategory : { $in : subCategoryId }
        }

        const skip = (page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product list",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        const product = await ProductModel.findOne({ _id : productId })


        return response.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const body = { ...request.body };
        // Normalize images field
        if (body.images && !body.image) {
            body.image = body.images;
            delete body.images;
        }

        if (body.image) body.image = normalizeStringArray(body.image);
        if (body.category) body.category = normalizeIdArray(body.category);
        if (body.subCategory) body.subCategory = normalizeIdArray(body.subCategory);

        const updateProduct = await ProductModel.updateOne({ _id : _id }, body)

        return response.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async(request,response)=>{
    try {
        let { search, page , limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit  = 10
        }

        // Use regex for partial matching (case insensitive)
        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'more_details.color': { $regex: search, $options: 'i' } }
            ]
        } : {}

        const skip = ( page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt  : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            data : data,
            totalCount :dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page : page,
            limit : limit 
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
