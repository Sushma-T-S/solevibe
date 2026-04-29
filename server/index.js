import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import brandRouter from './route/brand.route.js'
import wishlistRouter from './route/wishlist.route.js'
import adminRouter from './route/admin.route.js'
import deliveryBoyRouter from './route/deliveryBoy.route.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const app = express()

// Security headers with helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "res.cloudinary.com"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}))

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
          ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate limiting middleware (simple implementation)
const rateLimitStore = new Map()

// Enhanced rate limiting: IP + optional userId (for logged-in users)
const rateLimit = (req, res, next) => {
    // Skip rate limiting for order endpoints
    if (req.path.startsWith('/order/')) {
        return next()
    }
    
    const ip = req.ip || req.connection.remoteAddress
    const userId = req.userId // from auth middleware
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const limit = process.env.NODE_ENV === 'production' ? 500 : 1000 // Looser for dev
    
    const key = userId ? `${ip}_${userId}` : ip
    
    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    } else {
        const data = rateLimitStore.get(key)
        if (now > data.resetTime) {
            data.count = 1
            data.resetTime = now + windowMs
        } else {
            data.count++
            if (data.count > limit) {
                console.log(`Rate limit exceeded for ${key}: ${data.count}/${limit}`)
                return res.status(429).json({ 
                    message: `Too many requests. Please wait ${Math.ceil((data.resetTime - now)/1000/60)} minutes.`,
                    retryAfter: Math.ceil((data.resetTime - now)/1000),
                    success: false
                })
            }
        }
    }
    next()
}

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now()
    for (const [key, data] of rateLimitStore.entries()) {
        if (now > data.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 60 * 60 * 1000) // Clean up every hour

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Compression middleware
import compression from 'compression'
app.use(compression())

// Logging
// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SoleVibe API',
      version: '1.0.0',
      description: 'SoleVibe E-commerce API Documentation (MERN Stack)',
    },
    servers: [
      {
        url: 'http://localhost:5001',
      },
    ],
  },
  apis: ['./route/*.js'],
};

const specs = swaggerJsdoc(options);

app.use(morgan('dev'))

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// Serve local uploads folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
    maxAge: '1d', // Cache for 1 day
    etag: true,
    lastModified: true
}))

const PORT = process.env.PORT || 5001;

// Cache control middleware for API responses
app.use('/api', rateLimit)

app.get("/", (request, response) => {
    response.json({
        message: "Server is running " + PORT,
        timestamp: new Date().toISOString()
    })
})

// Health check endpoint
app.get("/health", (request, response) => {
    response.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

app.use('/api/user', userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/brand', brandRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/admin', adminRouter)
app.use('/api/delivery-boy', deliveryBoyRouter)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        message: "Route not found",
        success: false 
    })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        success: false,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running", PORT)
    })
})

