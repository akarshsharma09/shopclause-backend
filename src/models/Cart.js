import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
import Product from "./Product.js";

const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
});

// ✅ Relationships
// User.hasMany(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
// Cart.belongsTo(User, { foreignKey: "userId" });

// Product.hasMany(Cart, { foreignKey: "productId", onDelete: "CASCADE" });
// Cart.belongsTo(Product, { foreignKey: "productId" });

export default Cart;

