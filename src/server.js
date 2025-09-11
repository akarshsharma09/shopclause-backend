import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, sequelize } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import "./models/User.js";
import "./models/Category.js";
import "./models/Product.js";
import "./models/OrderItem.js";
import "./models/associations.js";

import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
const app = express();

// ✅ uploads folder ko static serve karo
app.use("/uploads", express.static("uploads"));

// app.use(cors());
app.use(cors({
  origin: ["http://localhost:5173", "https://shopclause.netlify.app"],
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Shopclues Backend API is running...");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);  
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// serve static files (images)
app.use("/images", express.static(path.join(__dirname, "public/images")));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true }); // DB tables auto create
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server error:", error);
  }
};

startServer();
