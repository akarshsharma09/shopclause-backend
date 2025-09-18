// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(".env") });
}

const DB_NAME = process.env.DB_NAME || process.env.MYSQLDATABASE;
const DB_USER = process.env.DB_USER || process.env.MYSQLUSER;
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
const DB_HOST = process.env.DB_HOST || process.env.MYSQLHOST;
const DB_PORT = process.env.DB_PORT || process.env.MYSQLPORT;
const DIALECT = "mysql";

// Debug logs
console.log("Using DB_HOST:", DB_HOST);
console.log("Using DB_PORT:", DB_PORT);
console.log("Using DB_NAME:", DB_NAME);
console.log("Using DB_USER:", DB_USER);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DIALECT,
  logging: false,
});

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("✅ MySQL Connected Successfully");
      break;
    } catch (error) {
      console.error("❌ Database connection error:", error.message);
      retries -= 1;
      console.log(`Retrying in 5 seconds... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  if (!retries) {
    console.error("❌ All retries failed. Exiting process.");
    process.exit(1);
  }
};

export { sequelize, connectDB };
