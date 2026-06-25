import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Configure Cloudinary storage for multer
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'connectpro',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
    },
  });
} else {
  console.log('⚠️ Cloudinary environment variables not set. Falling back to local disk storage.');
  
  // Ensure local uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const originalUpload = multer({ storage });
const upload = {
  single: (fieldname) => {
    const middleware = originalUpload.single(fieldname);
    return (req, res, next) => {
      middleware(req, res, (err) => {
        if (err) return next(err);
        if (req.file && !req.file.path.startsWith('http')) {
          // If saved locally, convert file.path to accessible local url
          const port = process.env.PORT || 5000;
          req.file.path = `http://localhost:${port}/uploads/${req.file.filename}`;
        }
        next();
      });
    };
  }
};

export { cloudinary, upload };

