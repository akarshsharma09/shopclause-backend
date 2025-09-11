import express from "express";
import { createCategory, getCategories, getCategoryWithProducts } from "../controllers/categoryController.js";
import  protect  from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCategory);  // Admin only
router.get("/", getCategories);
router.get("/:id", getCategoryWithProducts); // Category with products

export default router;
