import BrandModel from '../models/brand.model.js'

export const createBrand = async (request, response) => {
    try {
        const { name, image } = request.body
        
        if(!name){
            return response.status(400).json({
                message : "Provide brand name",
                success : false
            })
        }

        const brand = await BrandModel.create({ name, image })

        return response.status(201).json({
            message : "Brand created successfully",
            success : true,
            data : brand
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getBrand = async (request, response) => {
    try {
        const brand = await BrandModel.find().sort({ createdAt : -1 })

        return response.status(200).json({
            message : "Brand fetched successfully",
            success : true,
            data : brand
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateBrand = async (request, response) => {
    try {
        const { _id, name, image } = request.body

        const brand = await BrandModel.updateOne(
            { _id },
            { name, image }
        )

        return response.status(200).json({
            message : "Brand updated successfully",
            success : true,
            data : brand
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteBrand = async (request, response) => {
    try {
        const { _id } = request.body

        const brand = await BrandModel.deleteOne({ _id })

        return response.status(200).json({
            message : "Brand deleted successfully",
            success : true,
            data : brand
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
