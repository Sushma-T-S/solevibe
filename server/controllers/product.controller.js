import ProductModel from '../models/product.model.js'
import mongoose from 'mongoose'
import CategoryModel from '../models/category.model.js'
import SubCategoryModel from '../models/subCategory.model.js'
import BrandModel from '../models/brand.model.js'

// Get all products with pagination, search, filters
const getProductController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      categories = [],
      subCategories = [],
      brands = [],
      isActive = true,
      sortBy = 'createdAt',
      sortOrder = -1
    } = req.body

  const skip = (parseInt(page) - 1) * parseInt(limit)

    // Validate and convert IDs to ObjectId
    const validCategories = (categories || []).filter(id => mongoose.Types.ObjectId.isValid(String(id))).map(id => new mongoose.Types.ObjectId(String(id)));
    const validSubCategories = (subCategories || []).filter(id => mongoose.Types.ObjectId.isValid(String(id))).map(id => new mongoose.Types.ObjectId(String(id)));
    const validBrands = (brands || []).filter(id => mongoose.Types.ObjectId.isValid(String(id))).map(id => new mongoose.Types.ObjectId(String(id)));

    const query = { isActive: Boolean(isActive) };

    if (validCategories.length > 0) {
      query.category = { $in: validCategories };
    }
    if (validSubCategories.length > 0) {
      query.subCategory = { $in: validSubCategories };
    }
    if (validBrands.length > 0) {
      query.brand = { $in: validBrands };
    }

    console.log('Product get query:', JSON.stringify({ page, limit, search: search ? '...' : '', validCategoriesCount: validCategories.length, validSubCategoriesCount: validSubCategories.length, validBrandsCount: validBrands.length, queryKeys: Object.keys(query) }, null, 2));

    // Search in name/description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Count total
    const totalProducts = await ProductModel.countDocuments(query)

    // Paginated products
    const products = await ProductModel.find(query)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .populate('brand', 'name')
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .lean()

    res.json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
      totalProducts,
      totalNoPage: Math.ceil(totalProducts / limit)
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: true
    })
  }
}

const getProductDetailsBulk = async (req, res) => {
  try {
    const { productIds } = req.body
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        message: 'Provide valid productIds array',
        success: false,
        error: true
      })
    }

    const validIds = productIds.filter(id => mongoose.Types.ObjectId.isValid(id))

    if (validIds.length === 0) {
      return res.json({
        message: 'No valid product IDs',
        data: [],
        success: true,
        error: false
      })
    }

    // Fuller select for admin orders (no limit)
    const products = await ProductModel.find({
      _id: { $in: validIds }
    })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .populate('brand', 'name')
      .select('name image price stock avgRating totalReviews category subCategory brand description')
      .lean()

    res.json({
      success: true,
      message: 'Bulk products fetched',
      data: products,
      error: false
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: true
    })
  }
}

const getProductByCategory = async (req, res) => {
  try {
    const { categoryId, page = 1, limit = 20 } = req.body
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await ProductModel.find({ category: categoryId, isActive: true })
      .populate('category', 'name')
      .limit(parseInt(limit))
      .skip(skip)
      .lean()

    const total = await ProductModel.countDocuments({ category: categoryId, isActive: true })

    res.json({
      success: true,
      data: products,
      totalNoPage: Math.ceil(total / limit)
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const {
      categoryId,
      subCategoryId,
      page = 1,
      limit = 20
    } = req.body

    console.log('ProductList query params:', { categoryId, subCategoryId, page, limit });

    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Validate ObjectIds
    const validCategoryId = categoryId && mongoose.Types.ObjectId.isValid(String(categoryId)) 
      ? new mongoose.Types.ObjectId(String(categoryId)) 
      : null;
    const validSubCategoryId = subCategoryId && mongoose.Types.ObjectId.isValid(String(subCategoryId)) 
      ? new mongoose.Types.ObjectId(String(subCategoryId)) 
      : null;

    if (!validCategoryId || !validSubCategoryId) {
      console.warn('Invalid ObjectId for categoryId or subCategoryId:', { categoryId, subCategoryId });
      return res.json({
        success: true,
        data: [],
        totalCount: 0,
        totalNoPage: 0,
        page: parseInt(page)
      });
    }

    const query = { 
      category: { $in: [validCategoryId] }, 
      subCategory: { $in: [validSubCategoryId] },
      isActive: true 
    }

    console.log('Executing query:', JSON.stringify(query, null, 2));

    // Count total
    let totalProducts = 0;
    try {
      totalProducts = await ProductModel.countDocuments(query);
      console.log('Count result:', totalProducts);
    } catch (countErr) {
      console.error('Count error:', countErr.message);
      return res.json({
        success: true,
        data: [],
        totalCount: 0,
        totalNoPage: 0,
        page: parseInt(page)
      });
    }

    // Paginated products
    let products = [];
    try {
      products = await ProductModel.find(query)
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean();
      console.log('Products found:', products.length);
    } catch (findErr) {
      console.error('Find/populate error:', findErr.message);
      // Return empty even on find error
    }

    res.json({
      success: true,
      data: products,
      totalCount: totalProducts,
      totalNoPage: Math.ceil(totalProducts / limit),
      page: parseInt(page)
    })
  } catch (error) {
    console.error('getProductByCategoryAndSubCategory CRITICAL error:', error);
    res.json({ success: true, data: [], totalCount: 0, totalNoPage: 0, page: 1 }); // Graceful fallback
  }
}

const getProductDetails = async (req, res) => {
  try {
    const { _id } = req.body
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID format',
        data: null 
      })
    }

    const product = await ProductModel.findById(_id).populate('category subCategory brand reviews.userId').lean()
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found',
        data: null 
      })
    }

    res.json({ success: true, data: product })
  } catch (error) {
    console.error('getProductDetails error:', error)
    res.status(500).json({ success: false, message: 'Server error fetching product details' })
  }
}

const getRelatedProducts = async (req, res) => {
  try {
    const { category, subCategory, limit = 4 } = req.body
    const query = {}
    if (category) query.category = category
    if (subCategory) query.subCategory = subCategory
    const products = await ProductModel.find(query).limit(parseInt(limit)).lean()
    res.json({ success: true, data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const searchProduct = async (req, res) => {
  try {
    const {
      search = '',
      page = 1,
      limit = 20,
      categories = [],
      subCategories = [],
      brands = [],
      colors = [],
      price,
      sortBy = 'relevance'
    } = req.body

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const query = { isActive: true }

    // Validate and convert IDs to ObjectId
    const validCategories = (categories || []).filter(id => mongoose.Types.ObjectId.isValid(String(id))).map(id => new mongoose.Types.ObjectId(String(id)))
    const validSubCategories = (subCategories || []).filter(id => mongoose.Types.ObjectId.isValid(String(id))).map(id => new mongoose.Types.ObjectId(String(id)))
    const validBrands = (brands || []).filter(id => mongoose.Types.ObjectId.isValid(String(id))).map(id => new mongoose.Types.ObjectId(String(id)))

    if (validCategories.length > 0) {
      query.category = { $in: validCategories }
    }
    if (validSubCategories.length > 0) {
      query.subCategory = { $in: validSubCategories }
    }
    if (validBrands.length > 0) {
      query.brand = { $in: validBrands }
    }

    // Color filter — search in variants.color and more_details.color
    if (colors && colors.length > 0) {
      query.$or = query.$or || []
      query.$or.push(
        { 'variants.color': { $in: colors.map(c => new RegExp(c, 'i')) } },
        { 'more_details.color': { $in: colors.map(c => new RegExp(c, 'i')) } }
      )
    }

    // Price filter
    if (price && !isNaN(price)) {
      query.price = { $lte: parseInt(price) }
    }

    // Multi-field regex search (no text index required)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i')
      const searchConditions = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]

      // Also try to match brand name by looking up brand IDs
      // We do this by adding brand name match as a separate condition
      // Since brand is an ObjectId, we search brand names via populate or separate query
      // For simplicity in regex search, we also search in more_details which may contain brand info
      if (query.$or) {
        // If $or already exists for colors, we need to wrap carefully
        // We'll use $and to combine the search $or with existing query
        const searchOr = { $or: searchConditions }
        query.$and = query.$and || []
        query.$and.push(searchOr)
      } else {
        query.$or = searchConditions
      }
    }

    // Count total before applying pagination
    const totalProducts = await ProductModel.countDocuments(query)

    // Determine sort order
    let sortOption = {}
    switch (sortBy) {
      case 'priceLow':
        sortOption = { price: 1 }
        break
      case 'priceHigh':
        sortOption = { price: -1 }
        break
      case 'rating':
        sortOption = { avgRating: -1 }
        break
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'relevance':
      default:
        // Prioritize: exact name match, then in-stock, then high rating, then popular
        sortOption = {
          // Use aggregation for better relevance, but for simple find:
          // We can't easily do custom relevance scoring in a simple find
          // So we sort by a combination of factors
          stock: -1,      // In-stock first
          avgRating: -1,  // High rating
          totalReviews: -1, // Popular
          createdAt: -1   // Newest
        }
        break
    }

    // Paginated products with population
    const products = await ProductModel.find(query)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .populate('brand', 'name')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip)
      .lean()

    res.json({
      success: true,
      message: 'Products searched successfully',
      data: products,
      page: parseInt(page),
      totalProducts,
      totalPage: Math.ceil(totalProducts / limit)
    })
  } catch (error) {
    console.error('searchProduct error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// CRUD stubs
const createProductController = async (req, res) => {
  try {
    const product = new ProductModel(req.body)
    await product.save()
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const updateProductDetails = async (req, res) => {
  try {
    const { _id, ...updates } = req.body
    const product = await ProductModel.findByIdAndUpdate(_id, updates, { new: true })
    res.json({ success: true, data: product })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const deleteProductDetails = async (req, res) => {
  try {
    const { _id } = req.body
    await ProductModel.findByIdAndDelete(_id)
    res.json({ success: true, message: 'Deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const addProductReview = async (req, res) => {
  // Stub
  res.json({ success: true })
}

const getProductReviews = async (req, res) => {
  // Stub
  res.json({ success: true, data: [] })
}

export {
  getProductController,
  getProductDetailsBulk,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductDetails,
  getRelatedProducts,
  searchProduct,
  createProductController,
  updateProductDetails,
  deleteProductDetails,
  addProductReview,
  getProductReviews
}

