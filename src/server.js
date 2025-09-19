// src/server.js
import express from "express";
// import dotenv from "dotenv";
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
import fs from "fs";

console.log("All ENV Vars:", process.env);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
// dotenv.config();

const app = express();

// ✅ Serve uploads folder
// app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.resolve("./uploads")));

// ✅ Temporary Debug Route
app.get("/debug/uploads", (req, res) => {
  const dirPath = path.resolve("./uploads");
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        error: "Uploads folder not found",
        details: err.message,
      });
    }
    res.json({ files });
  });
});

// ✅ Enable CORS for frontend
app.use(cors({
  origin: ["http://localhost:5173", "https://shopclause.netlify.app"],
  credentials: true,
}));

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 ShopClause Backend API is running...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ Static images (public folder)

app.use("/images", express.static(path.join(__dirname, "public/images")));

const PORT = process.env.PORT || 5000;

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true }); // Auto create/alter DB tables

    app.listen(PORT, () => {
      console.log("======================================");
      console.log("✅ Database connected");
      console.log(`🚀 Server running on port: ${PORT}`);
      console.log("======================================");
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
  }
};

startServer();
