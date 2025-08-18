import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cookieSession from "cookie-session";
import { connectToDatabase } from "./Database/database";
import logger from "./Utils/logger";
import gameRoutes from "./Routes/gameRoutes";
import { sessionIdMiddleware } from "./Middleware/sessionId";
import UserModel from "./Models/userModel";
import GameSessionModel from "./Models/gameSessionModel";
import dotenv from "dotenv";
dotenv.config();

// Ensure that the required environment variables are set
if (!process.env.PORT) {
    logger.error("PORT environment variable is not set.");
    throw new Error("PORT environment variable is not set.");
}

// Initialize express application
const app = express();
app.use(express.json());

// Add cookie session middleware
app.use(cookieSession({
    name: "yakuzadle-session",
    keys: [`${process.env.COOKIE_SECRET_KEY}`],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(sessionIdMiddleware);

// Swagger options
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Yakuzadle API",
            version: "1.0.0",
            description: "API for a Wordle-like game for Like a Dragon."
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8081}`
            }
        ]
    },
    apis: ["src/Routes/*.js"]
};

// Swagger documentation setup
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
gameRoutes(app);

try {
    connectToDatabase().then(() => {
        logger.info("Database connection established successfully.");
    }).then(() => {
            UserModel.sync();
            GameSessionModel.sync();
        }).then(() => {
            logger.info("Synchronization with User and GameSession tables successful.")

            app.listen(process.env.PORT, () => {
                logger.info(`Server is running on http://localhost:${process.env.PORT}`);
            })
        });
} catch (error) {
    logger.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if the database connection fails
}

export default app;