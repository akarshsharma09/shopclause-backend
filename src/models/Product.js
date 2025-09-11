import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Category from "./Category.js";
import OrderItem from "./OrderItem.js"; 

const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  image: { type: DataTypes.STRING },
  deal_price: DataTypes.DECIMAL(10,2),
});

// Relation: ek category ke under multiple products
// Category.hasMany(Product, { foreignKey: "categoryId" , onDelete: "CASCADE" });
// Product.belongsTo(Category, { foreignKey: "categoryId", as: "Category"});

// // Relation with OrderItem
// Product.hasMany(OrderItem, { foreignKey: "productId", onDelete: "CASCADE" });
export default Product;
