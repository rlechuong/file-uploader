import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const storageKey = crypto.randomUUID() + path.extname(file.originalname);
    cb(null, storageKey);
  },
});

const upload = multer({ storage });

export { upload };
