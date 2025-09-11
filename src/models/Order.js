// models/Order.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
import OrderItem from "./OrderItem.js";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMode: {
    type: DataTypes.STRING, // COD, UPI, Card
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING, // Pending, Success, Failed
    defaultValue: "Pending",
  },
  status: {
    type: DataTypes.STRING, // Placed, Shipped, Delivered, Cancelled
    defaultValue: "Placed",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// ✅ Associations
// Order.belongsTo(User, { foreignKey: "userId", as: "User", onDelete: "CASCADE" });
// Order.hasMany(OrderItem, { foreignKey: "orderId", as: "OrderItems", onDelete: "CASCADE" });

export default Order;
