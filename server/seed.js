import mongoose from 'mongoose'
import CategoryModel from './models/category.model.js'
import SubCategoryModel from './models/subCategory.model.js'
import ProductModel from './models/product.model.js'
import UserModel from './models/user.model.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import bcryptjs from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const seedDatabase = async () => {
    try {
        // Connect to DB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        // Clear existing data
        await CategoryModel.deleteMany()
        await SubCategoryModel.deleteMany()
        // await ProductModel.deleteMany()
        await UserModel.deleteMany()

        // Create admin user
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash('admin123', salt)
        const adminUser = new UserModel({
            name: 'Admin',
            email: 'admin@solevibe.com',
            password: hashPassword,
            role: 'ADMIN',
            verify_email: true
        })
        await adminUser.save()
        console.log('Admin user created: email - admin@solevibe.com, password - admin123')

        // Define categories
        const categories = [
            { name: 'Mens', image: '/uploads/mens/mens_sneakers/blacl_sneakers.jpg' },
            { name: 'Womens', image: '/uploads/womens/womens_sneakers/beige_sneakers.jpg' },
            { name: 'Boys', image: '/uploads/kids/boys/boys_sneakers/black_sneakers.jpg' },
            { name: 'Girls', image: '/uploads/kids/girls/girls_sneakers/girls_sneaker1.jpg' }
        ]

        const createdCategories = await CategoryModel.insertMany(categories)
        console.log('Categories created')

        // Map category names to IDs
        const categoryMap = {}
        createdCategories.forEach(cat => {
            categoryMap[cat.name.toLowerCase()] = cat._id
        })

        // Define subcategories
        const subCategories = [
            // Mens
            { name: 'Mens Boots', image: '/uploads/mens/mens_boots/black_boot.jpg', category: [categoryMap.mens] },
            { name: 'Mens Casuals', image: '/uploads/mens/mens_casuals/mens_casual1.jpg', category: [categoryMap.mens] },
            { name: 'Mens Formal', image: '/uploads/mens/mens_formal/mens_formal1.jpg', category: [categoryMap.mens] },
            { name: 'Mens Sandals', image: '/uploads/mens/mens_sandals/mens_sandal1.jpg', category: [categoryMap.mens] },
            { name: 'Mens Slippers', image: '/uploads/mens/mens_slippers/mens_slipper1.jpg', category: [categoryMap.mens] },
            { name: 'Mens Sneakers', image: '/uploads/mens/mens_sneakers/mens_sneaker1.jpg', category: [categoryMap.mens] },
            { name: 'Mens Sports', image: '/uploads/mens/mens_sports/mens_sport1.jpg', category: [categoryMap.mens] },
            // Womens
            { name: 'Womens Boots', image: '/uploads/womens/womens_boots/womens_boot1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Casuals', image: '/uploads/womens/womens_casuals/womens_casual1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Ethnic', image: '/uploads/womens/womens_ethnic/womens_ethnic1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Flats', image: '/uploads/womens/womens_flats/womens_flat1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Formals', image: '/uploads/womens/womens_formals/womens_formal1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Heels', image: '/uploads/womens/womens_heels/womens_heel1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Sandals', image: '/uploads/womens/womens_sandals/womens_sandal1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Slippers', image: '/uploads/womens/womens_slippers/womens_slipper1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Sneakers', image: '/uploads/womens/womens_sneakers/womens_sneaker1.jpg', category: [categoryMap.womens] },
            { name: 'Womens Sports', image: '/uploads/womens/womens_sports/womens_sport1.jpg', category: [categoryMap.womens] },
            // Boys (replacing Kids)
            { name: 'Boys Sneakers', image: '/uploads/kids/boys/boys_sneaker1.jpg', category: [categoryMap.boys] },
            { name: 'Boys Casuals', image: '/uploads/kids/boys/boys_casuals/boys_casual1.jpg', category: [categoryMap.boys] },
            { name: 'Boys Sandals', image: '/uploads/kids/boys/boys_sandals/boys_sandal1.jpg', category: [categoryMap.boys] },
            { name: 'Boys Slippers', image: '/uploads/kids/boys/boys_slippers/boys_slipper1.jpg', category: [categoryMap.boys] },
            { name: 'Boys Sports', image: '/uploads/kids/boys/boys_sports/boys_sport1.jpg', category: [categoryMap.boys] },
            // Girls
            { name: 'Girls Sneakers', image: '/uploads/kids/girls/girls_sneaker1.jpg', category: [categoryMap.girls] },
            { name: 'Girls Casuals', image: '/uploads/kids/girls/girls_casuals/girls_casual1.jpg', category: [categoryMap.girls] },
            { name: 'Girls Sandals', image: '/uploads/kids/girls/girls_sandals/girls_sandal1.jpg', category: [categoryMap.girls] },
            { name: 'Girls Slippers', image: '/uploads/kids/girls/girls_slippers/girls_slipper1.jpg', category: [categoryMap.girls] },
            { name: 'Girls Sports', image: '/uploads/kids/girls/girls_sports/girls_sport1.jpg', category: [categoryMap.girls] }
        ]

        await SubCategoryModel.insertMany(subCategories)
        console.log('Subcategories created')

        // Now create sample products
        const sampleProducts = [
            {
                name: 'Mens Sneaker 1',
                image: ['/uploads/mens/mens_sneakers/blacl_sneakers.jpg'],
                category: [categoryMap.mens],
                subCategory: [],
                unit: 'pair',
                stock: 50,
                price: 2999,
                discount: 10,
                description: 'Comfortable mens sneaker',
                more_details: { size: '8-12', color: 'black' }
            },
            {
                name: 'Womens Heels 1',
                image: ['/uploads/womens/womens_sneakers/beige_sneakers.jpg'],
                category: [categoryMap.womens],
                subCategory: [],
                unit: 'pair',
                stock: 30,
                price: 1999,
                discount: 15,
                description: 'Elegant womens heels',
                more_details: { size: '6-10', color: 'red' }
            },
            {
                name: 'Boys Sneaker 1',
                image: ['/uploads/kids/boys/boys_sneakers/black_sneakers.jpg'],
                category: [categoryMap.boys],
                subCategory: [],
                unit: 'pair',
                stock: 40,
                price: 1499,
                discount: 5,
                description: 'Fun boys sneaker',
                more_details: { size: '2-6', color: 'blue' }
            }
        ]

        // await ProductModel.insertMany(sampleProducts)
        // console.log('Sample products created')

        console.log('Seeding completed without sample products')
        process.exit(0)
    } catch (error) {
        console.error('Seeding error:', error)
        process.exit(1)
    }
}

seedDatabase()
