import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getDeals,
} from "../controllers/productController.js";
import  protect  from "../middlewares/authMiddleware.js";
import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";

const router = express.Router();

// ---------------- Multer Config ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }); // ✅ ab upload defined hai

// Public
router.get("/", getProducts);
router.get("/deals", getDeals);
router.get("/:id", getProductById);


// Protected (Admin/User)
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

// ✅ Hybrid upload route (single + multiple)
router.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 1 },     // single image
    { name: "images", maxCount: 10 },   // multiple images
  ]),
  async (req, res) => {
    try {
      // Agar single image aayi hai
      let imageUrl = null;
      if (req.files["image"]) {
        imageUrl = `http://localhost:5000/uploads/${req.files["image"][0].filename}`;
      }

      // Agar multiple images aayi hain
      let imageUrls = [];
      if (req.files["images"]) {
        imageUrls = req.files["images"].map(
          (file) => `http://localhost:5000/uploads/${file.filename}`
        );
      }

      if (!imageUrl && imageUrls.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      res.json({
        message: "Upload successful",
        imageUrl,   // single
        imageUrls,  // multiple
      });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  }
);


export default router;
