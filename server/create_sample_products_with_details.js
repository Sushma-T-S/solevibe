import mongoose from 'mongoose'
import ProductModel from './models/product.model.js'
import BrandModel from './models/brand.model.js'
import CategoryModel from './models/category.model.js'
import SubCategoryModel from './models/subCategory.model.js'
import connectDB from './config/connectDB.js'
import dotenv from 'dotenv'

dotenv.config()

const createSampleProducts = async () => {
  try {
    await connectDB()
    console.log('✅ Connected to DB')

    // Fetch existing refs
    const brands = await BrandModel.find({}, { _id: 1, name: 1 }).limit(3)
    const categories = await CategoryModel.find({}, { _id: 1, name: 1 }).limit(2)
    const subcats = await SubCategoryModel.find({}, { _id: 1, name: 1 }).limit(2)

    if (brands.length === 0 || categories.length === 0) {
      console.log('⚠️ Create brands/categories first using admin panel or seed.js')
      return
    }

    const sampleProducts = [
      {
        name: "Nike Air Zoom Pegasus 40 - Black",
        image: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        category: [categories[0]._id],
        subCategory: [subcats[0]?._id || null],
        brand: brands[0]._id,
        price: 1200,
        mrp: 1500,
        discount: 20,
        stock: 25,
        description: "Premium running shoe with responsive cushioning and breathable mesh upper. Perfect for daily runs.",
        more_details: {
          material: "Synthetic Leather & Mesh",
          productColor: "Black"
        },
        variants: [{
          color: "Black",
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
          sizes: [
            { size: "8", stock: 10 },
            { size: "9", stock: 8 },
            { size: "10", stock: 7 }
          ]
        }]
      },
      {
        name: "Adidas Ultraboost 22 - White",
        image: ['https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500'],
        category: [categories[1]?._id || categories[0]._id],
        subCategory: [subcats[1]?._id || null],
        brand: brands[1]?._id || brands[0]._id,
        price: 999,
        mrp: 1299,
        discount: 23,
        stock: 15,
        description: "Lightweight sneakers with Boost cushioning for ultimate comfort.",
        more_details: {
          material: "Primeknit & Continental Rubber",
          productColor: "White/Cloud White"
        },
        variants: [{
          color: "White",
          images: ['https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500'],
          sizes: [
            { size: "7", stock: 5 },
            { size: "8", stock: 6 },
            { size: "9", stock: 4 }
          ]
        }]
      }
    ]

    for (const productData of sampleProducts) {
      await ProductModel.findOneAndUpdate(
        { name: productData.name },
        productData,
        { upsert: true, new: true }
      )
      console.log(`✅ Created/Updated: ${productData.name}`)
    }

    const products = await ProductModel.find({}).populate('brand category subCategory').limit(2)
    console.log('\n📋 Test these URLs:')
    products.forEach(p => {
      console.log(`  http://localhost:3000/product/${p.name.replace(/ /g, '-')}-${p._id}`)
    })

    console.log('\n🎉 Sample products with full details created!')
    mongoose.connection.close()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createSampleProducts()

