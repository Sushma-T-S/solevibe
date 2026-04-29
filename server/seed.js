import mongoose from 'mongoose'
import CategoryModel from './models/category.model.js'
import SubCategoryModel from './models/subCategory.model.js'
import ProductModel from './models/product.model.js'
import UserModel from './models/user.model.js'
import dotenv from 'dotenv'
import bcryptjs from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const seedDatabase = async () => {
  try {
    // 🚨 PRODUCTION SAFETY CHECK
    if (process.env.NODE_ENV === "production") {
      console.log("❌ Seeding blocked in PRODUCTION mode")
      console.log("✅ Only run in development/staging")
      process.exit(1)
    }

    console.log("🚀 Production-ready seeding started...")

    // Connect DB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ MongoDB connected")

    // 1. SECURE ADMIN (upsert)
    const adminPassword = process.env.ADMIN_PASSWORD || 'SuperSecureSeedAdmin@123!'
    const hashPassword = await bcryptjs.hash(adminPassword, 10)
    
    await UserModel.updateOne(
      { email: "admin@solevibe.com" },
      {
        name: "Admin",
        email: "admin@solevibe.com",
        password: hashPassword,
        role: "ADMIN",
        verify_email: true,
        status: "Active"
      },
      { upsert: true, new: true }
    )
    console.log("✅ Admin created/updated:", "admin@solevibe.com")
    console.log("   Password:", adminPassword)

    // 2. CATEGORIES (upsert)
    const categories = [
      { name: 'Mens', image: '/uploads/mens/mens_sneakers/black_sneakers.jpg' },
      { name: 'Womens', image: '/uploads/womens/womens_sneakers/beige_sneakers.jpg' },
      { name: 'Boys', image: '/uploads/kids/boys/boys_sneakers/black_sneakers.jpg' },
      { name: 'Girls', image: '/uploads/kids/girls/girls_sneakers/girls_sneaker1.jpg' }
    ]

    for (const cat of categories) {
      await CategoryModel.updateOne(
        { name: cat.name },
        { $set: { image: cat.image } },
        { upsert: true }
      )
    }
    console.log("✅ Categories upserted (4)")

    // 3. Get category map from DB
    const categoryDocs = await CategoryModel.find({}, { _id: 1, name: 1 })
    const categoryMap = {}
    categoryDocs.forEach(doc => {
      categoryMap[doc.name.toLowerCase()] = doc._id
    })
    console.log("✅ Category map created")

    // 4. SUBCATEGORIES (upsert with category refs)
    const subCategories = [
      // Mens
      { name: 'Mens Sneakers', image: '/uploads/mens/mens_sneakers/mens_sneaker1.jpg', category: [categoryMap.mens] },
      { name: 'Mens Boots', image: '/uploads/mens/mens_boots/black_boot.jpg', category: [categoryMap.mens] },
      { name: 'Mens Casuals', image: '/uploads/mens/mens_casuals/mens_casual1.jpg', category: [categoryMap.mens] },
      // Womens (sample)
      { name: 'Womens Heels', image: '/uploads/womens/womens_heels/womens_heel1.jpg', category: [categoryMap.womens] },
      { name: 'Womens Sneakers', image: '/uploads/womens/womens_sneakers/womens_sneaker1.jpg', category: [categoryMap.womens] },
      // Boys
      { name: 'Boys Sneakers', image: '/uploads/kids/boys/boys_sneaker1.jpg', category: [categoryMap.boys] },
      // Girls
      { name: 'Girls Sneakers', image: '/uploads/kids/girls/girls_sneaker1.jpg', category: [categoryMap.girls] }
    ]

    for (const sub of subCategories) {
      await SubCategoryModel.updateOne(
        { name: sub.name },
        { $set: { image: sub.image, category: sub.category } },
        { upsert: true }
      )
    }
    console.log("✅ Subcategories upserted (7)")

    // 5. SAMPLE PRODUCTS (FIXED structure)
    const sampleProducts = [
      {
        name: "Mens Sneaker 1",
        image: ["/uploads/mens/mens_sneakers/mens_sneaker1.jpg"], // ✅ FIXED
        category: [categoryMap.mens],
        subCategory: [],
        unit: "pair",
        stock: 50,
        price: 2999,
        discount: 10,
        description: "Comfortable mens sneaker with premium cushioning",
        more_details: { size: "8-12", color: "black" }
      },
      {
        name: "Womens Heels 1",
        image: ["/uploads/womens/womens_heels/womens_heel1.jpg"],
        category: [categoryMap.womens],
        subCategory: [],
        unit: "pair",
        stock: 30,
        price: 1999,
        discount: 15,
        description: "Elegant womens heels for special occasions",
        more_details: { size: "6-10", color: "red" }
      },
      {
        name: "Boys Sneaker 1",
        image: ["/uploads/kids/boys/boys_sneaker1.jpg"],
        category: [categoryMap.boys],
        subCategory: [],
        unit: "pair",
        stock: 40,
        price: 1499,
        discount: 5,
        description: "Fun and durable boys sneaker",
        more_details: { size: "2-6", color: "blue" }
      }
    ]

    for (const product of sampleProducts) {
      await ProductModel.updateOne(
        { name: product.name },
        { $set: product },
        { upsert: true }
      )
    }
    console.log("✅ Sample products upserted (3)")

    console.log("\n🎉 SEEDING COMPLETE!")
    console.log("💡 To run: cd solevibe/server && NODE_ENV=development node seed.js")
    console.log("🔐 Admin: admin@solevibe.com / check .env ADMIN_PASSWORD")
    process.exit(0)

  } catch (error) {
    console.error("❌ Seeding failed:", error.message)
    process.exit(1)
  }
}

export default seedDatabase

// MANUAL RUN ONLY - NO AUTO EXECUTE!
// node solevibe/server/seed.js

