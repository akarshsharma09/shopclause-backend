// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Load .env in local dev only
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(".env") });
}

// Debug logs
console.log("Using DB_HOST:", process.env.DB_HOST);
console.log("Using DB_PORT:", process.env.DB_PORT);
console.log("Using DB_NAME:", process.env.DB_NAME);
console.log("Using DB_USER:", process.env.DB_USER);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

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
