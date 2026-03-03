import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary credentials are available
const hasCloudinaryCredentials = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

console.log("Cloudinary credentials check:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "set" : "not set",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "set" : "not set",
  hasCloudinaryCredentials
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, webp, gif)"), false);
  }
};

let upload;

if (hasCloudinaryCredentials) {
  try {
    // Import cloudinary
    const cloudinaryModule = await import("../config/cloudinary.js");
    const cloudinary = cloudinaryModule.default;
    
    // Create Cloudinary storage
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "solevibe",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
      },
    });
    
    upload = multer({ 
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter
    });
    console.log("Using Cloudinary storage - images will be uploaded to Cloudinary!");
  } catch (cloudinaryError) {
    console.error("Cloudinary storage initialization error:", cloudinaryError);
    throw new Error("Cloudinary initialization failed: " + cloudinaryError.message);
  }
} else {
  // No credentials - use local storage as fallback
  console.log("WARNING: No Cloudinary credentials found. Using local storage.");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadsRoot)) {
        fs.mkdirSync(uploadsRoot, { recursive: true });
      }
      cb(null, uploadsRoot);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, uniqueSuffix + extension);
    }
  });
  upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
  });
}

export default upload;
