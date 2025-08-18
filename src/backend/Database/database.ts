import { Sequelize } from "sequelize";
import logger from "../Utils/logger";
import dotenv from "dotenv";
dotenv.config();

// Making sure that the required environment variables for the database are set
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    logger.error("Database environment variables are not set.");
    throw new Error("Database environment variables are not set.");
}

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        timezone: "-03:00",
    }
);

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        logger.info("Database connection has been established successfully.");
    } catch (error) {
        logger.error("Unable to connect to the database:", error);
        throw error;
    }
}

export { sequelize, connectToDatabase };