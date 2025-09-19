import Category from "../models/Category.js";
import Product from "../models/Product.js"; 

// Create Category
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
order: [['id', 'ASC']] 
});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Get Category with Products
export const getCategoryWithProducts = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: ["Products"], // Sequelize relation
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category products", error });
  }
};
