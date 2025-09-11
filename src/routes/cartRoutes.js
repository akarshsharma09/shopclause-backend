import express from "express";
import  protect  from "../middlewares/authMiddleware.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", protect, addToCart);       // Add to cart
router.get("/", protect, getCart);          // Get user cart
router.put("/:id", protect, updateCartItem); // Update cart item
router.delete("/:id", protect, removeFromCart); // Remove cart item

export default router;
