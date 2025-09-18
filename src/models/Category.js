import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
 {
    tableName: "categories", // 👈 Force lowercase table name
    timestamps: false,
  }
);

export default Category;
