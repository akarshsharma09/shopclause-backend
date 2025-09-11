// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Load .env for local development, Railway injects env automatically in production
const envFile = process.env.NODE_ENV === "production" ? null : ".env";
if (envFile) {
  dotenv.config({ path: path.resolve(envFile), debug: false });
}

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // disable SQL logs
  }
);

// Connect to DB with retry logic
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
  if (!retries) process.exit(1); // exit if DB never connects
};

export { sequelize, connectDB };
