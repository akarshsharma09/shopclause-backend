// src/routes/productRoutes.js
import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getDeals,
} from "../controllers/productController.js";
import protect from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ---------------- Multer Config ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- Public Routes ----------------
router.get("/", async (req, res) => {
  try {
    const products = await getProducts(); // assume controller returns all products
    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

    const productsWithFullImage = products.map((p) => ({
      ...p.toJSON ? p.toJSON() : p, // Sequelize or plain object
      image: p.image ? `${BASE_URL}/uploads/${p.image}` : null,
    }));

    res.json(productsWithFullImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/deals", getDeals);
router.get("/:id", getProductById);

// ---------------- Protected Routes ----------------
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

// ---------------- Upload Route ----------------
router.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 1 },   // single image
    { name: "images", maxCount: 10 }, // multiple images
  ]),
  async (req, res) => {
    try {
      const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

      // Single image
      let imageUrl = null;
      if (req.files["image"]) {
        imageUrl = `${BASE_URL}/uploads/${req.files["image"][0].filename}`;
      }

      // Multiple images
      let imageUrls = [];
      if (req.files["images"]) {
        imageUrls = req.files["images"].map(
          (file) => `${BASE_URL}/uploads/${file.filename}`
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
      console.error(error);
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  }
);

export default router;
