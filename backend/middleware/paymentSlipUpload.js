import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads", "payments");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = path.extname(file.originalname);
    cb(null, `payment-slip-${timestamp}-${random}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/png", "image/jpeg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG and JPG files are allowed"));
  }
};

const paymentSlipUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Error handling middleware for multer
export const handlePaymentSlipUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File size must be less than 5MB" });
    }
    return res.status(400).json({ success: false, message: "File upload failed" });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  // Continue to next middleware/controller if no error
  return next();
};

export default paymentSlipUpload;
