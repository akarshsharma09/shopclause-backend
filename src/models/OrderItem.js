// models/OrderItem.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Product from "./Product.js";

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
},
                                   {
    tableName: "orderitems", // 👈 Force lowercase table name
    timestamps: false,
  });

// ✅ Relation
// OrderItem.belongsTo(Product, { foreignKey: "productId", as: "Product" });

export default OrderItem;
