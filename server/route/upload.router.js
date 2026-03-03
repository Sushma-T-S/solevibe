import { Router } from 'express'
import uploadImageController from '../controllers/uploadImage.controller.js'
import upload from '../middleware/multer.js'

const uploadRouter = Router()

// Upload endpoint with proper error handling
uploadRouter.post("/upload", (req, res) => {
    upload.single("image")(req, res, function(err) {
        if (err) {
            console.error("Multer error:", err)
            return res.status(400).json({
                message: err.message || "File upload error",
                error: true,
                success: false
            })
        }
        
        // Continue to controller
        uploadImageController(req, res)
    })
})

export default uploadRouter
