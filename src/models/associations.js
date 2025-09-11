// associations.js
import User from "./User.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Cart from "./Cart.js";

// =========================
// Category ↔ Products
// =========================
Category.hasMany(Product, { foreignKey: "categoryId", as: "Products", onDelete: "CASCADE" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "Category" });

// =========================
// User ↔ Orders
// =========================
User.hasMany(Order, { foreignKey: "userId", as: "Orders", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId", as: "User" });

// =========================
// Order ↔ OrderItems
// =========================
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "OrderItems", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "Order" });

// =========================
// Product ↔ OrderItems
// =========================
Product.hasMany(OrderItem, { foreignKey: "productId", as: "OrderItems", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "Product" });

// =========================
// User ↔ Cart
// =========================
User.hasMany(Cart, { foreignKey: "userId", as: "Carts", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId", as: "User" });

// =========================
// Product ↔ Cart
// =========================
Product.hasMany(Cart, { foreignKey: "productId", as: "Carts", onDelete: "CASCADE" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "Product" });

export {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Cart
};
