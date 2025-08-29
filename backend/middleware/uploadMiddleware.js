import crypto from "crypto"
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "./public/img"),
  filename: (_, file, cb) => {
    crypto.randomBytes(12, (err, bytes) => {
      if (err) return cb(err);
      const name = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, name);               // unique filename
    });
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per image
    files: 10,                 // max 10 images per request (set as per your need)
  },
  fileFilter: (_, file, cb) => {
    const mime = file.mimetype;
    mime.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Only images allowed"));
  },
});

