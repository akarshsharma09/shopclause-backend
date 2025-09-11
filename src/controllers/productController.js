import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { Op } from "sequelize";


// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock,image, categoryId,deal_price } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      stock: stock || 0,
      categoryId,
      image, 
      deal_price
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Get all products (with optional category filter + search)
export const getProducts = async (req, res) => {
  try {
    const { category, categoryId, search } = req.query;

    let whereClause = {};
    let include = [];

    // Filter by categoryId
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // 🔍 Filter by search (name/description me search karna)
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Filter by category name
    if (category) {
      include.push({
        model: Category,
        as: "Category", // 👈 alias same hona chahiye
        where: { name: category },
      });
    } else {
      include.push({ model: Category, as: "Category" });
    }

    const products = await Product.findAll({
      where: whereClause,
      include,
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "Category" }], // 👈 alias required
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};


// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, price, description, stock, categoryId,image ,deal_price} = req.body;

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.stock = stock ?? product.stock;
    product.image = image || product.image;
    product.categoryId = categoryId ?? product.categoryId;
    product.deal_price = deal_price || product.deal_price;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};


//  Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};


// GET /products/deals
export const getDeals = async (req, res) => {
  try {
    const deals = await Product.findAll({
      where: { deal_price: { [Op.ne]: null } },
      attributes: ["id", "name", "price", "deal_price", "image"]
    });

    // Always return array
    res.status(200).json(deals);
  } catch (err) {
    console.error("Error fetching deals:", err);
    res.status(500).json({ message: "Server error" });
  }
};



