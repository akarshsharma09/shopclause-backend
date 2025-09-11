import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load .env.local for local dev, ignore in Railway
const envFile = process.env.NODE_ENV === "production" ? null : ".env.local";
if (envFile) dotenv.config({ path: envFile });

// In production, Railway injects variables automatically
// In local dev, .env.local provides local MySQL config
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

const connectDB = async () => {
  let retries = 5; // retry 5 times if DB is not ready
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("✅ MySQL Connected Successfully");
      break;
    } catch (error) {
      console.error("❌ Database connection error:", error);
      retries -= 1;
      console.log(`Retrying in 5 seconds... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  if (!retries) process.exit(1); // exit if DB never connects
};

export { sequelize, connectDB };
