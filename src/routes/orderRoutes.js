import express from "express";
import { checkout,getUserOrders } from "../controllers/orderController.js";
import  protect  from "../middlewares/authMiddleware.js";


const router = express.Router();

// Checkout
router.post("/checkout", protect, checkout);
router.get("/", protect, getUserOrders); 
export default router;
