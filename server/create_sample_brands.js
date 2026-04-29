import mongoose from 'mongoose'
import BrandModel from './models/brand.model.js'
import connectDB from './config/connectDB.js'
import dotenv from 'dotenv'

dotenv.config()

const createSampleBrands = async () => {
  try {
    await connectDB()
    console.log('✅ Connected to DB')

    const sampleBrands = [
      { name: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
      { name: 'Adidas', image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200' },
      { name: 'Puma', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200' }
    ]

    for (const brandData of sampleBrands) {
      await BrandModel.findOneAndUpdate(
        { name: brandData.name },
        brandData,
        { upsert: true, new: true }
      )
      console.log(`✅ Created/Updated: ${brandData.name}`)
    }

    console.log('\n🎉 3 Sample brands created!')
    console.log('Now run: cd .. && node server/seed.js then node server/create_sample_products_with_details.js')
    mongoose.connection.close()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createSampleBrands()
