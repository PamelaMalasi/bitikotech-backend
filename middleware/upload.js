import multer from "multer";

/**
 * Use memory storage so files are NOT saved to disk.
 * The file will be available as req.file.buffer
 * and will be uploaded directly to Cloudinary.
 */
const storage = multer.memoryStorage();

/**
 * Allow only image uploads
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP, and PDF files are allowed"), false);
  }
};

/**
 * Multer upload middleware
 */
export const upload = multer({
  storage,
  fileFilter,
});