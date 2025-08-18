import gameService from "../Services/gameService";
import { Status, GameModel } from "../Models/gameModel";
import GameSessionModel from "../Models/gameSessionModel";
import { Response } from "express";
import { SessionRequest } from "../Middleware/sessionId";
import logger from "../Utils/logger";
import UserService from "../Services/userService";
import GameSessionService from "../Services/gameSessionService";

class GameController {
    private gameService: typeof gameService;
    private game: GameModel;

    constructor() {
        this.gameService = gameService;
        this.game = gameService.game; // Access the game instance from the service
    }

    home(req: SessionRequest, res: Response) {
        res.status(200).json({ message: "Yakuzadle API is running" });
    }

    async startGame(req: SessionRequest, res: Response) {
        try {
            const sessionId = (req.session as any).sessionId;

            // Starting game
            const characterDetails = await this.gameService.startGame(sessionId);
            logger.info("Game started successfully.");
            logger.debug(`Word to guess: ${this.game.wordToGuess}`);
            logger.debug(`Character details: ${JSON.stringify(characterDetails)}`)

            // After game has been started, get user and game session
            const existingUser = await UserService.findUserBySessionId(sessionId);
            let user;
            if (!existingUser) {
                user = await UserService.createUser(sessionId);
                logger.info("User created successfully");
            } else {
                user = existingUser;
            }

            let gameSession = await GameSessionService.findLatestActiveSessionForUser(user.id);
            if (!gameSession) {
                // If no active game session is found, create one
                gameSession = await GameSessionService.createGameSession(user.id, Status.InProgress);
                logger.info("Game session created successfully")
            }

            req.session.userId = user.id;
            req.session.gameSessionId = gameSession.id;
            logger.debug(`Starting game for user id: ${user.id} and game session id: ${gameSession.id}`)

            res.status(200).json({ message: "Game started successfully" });
        } catch (error) {
            logger.error("Error starting game:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            res.status(500).json({ error: errorMessage });
        }
    }

    async guessWord(req: SessionRequest, res: Response) {
        const userId = req.session.userId;
        const gameSessionId = req.session.gameSessionId;
        logger.debug(`Guessing word for user id: ${userId} and game session id: ${gameSessionId}`)

        if (!userId || !gameSessionId) {
            return res.status(400).json({ error: "No active game session. Start a new game first." });
        }

        let gameSession = GameSessionModel.findByPk(gameSessionId);

        const guessedWord = req.body.guessedWord;

        try {
            const result = await this.gameService.guessWord(guessedWord);
            switch (result) {
                case "Correct guess":
                    logger.info("Correct guess made.");
                    gameSession = GameSessionService.updateGameSession(
                        gameSessionId, 
                        Status.Completed,
                        false
                    );
                    res.status(200).json({ message: "Correct guess"});
                    break;
                case "Game failed":
                    logger.info("Game failed due to maximum attempts.");
                    gameSession = GameSessionService.updateGameSession(
                        gameSessionId, 
                        Status.Failed,
                        false
                    );
                    res.status(200).json({ message: `Game failed. Correct word: ${this.game.wordToGuess}`});
                    break;
                case "Incorrect guess":
                    logger.info("Incorrect guess made.");
                    gameSession = GameSessionService.updateGameSession(
                        gameSessionId, 
                        Status.InProgress,
                        true
                    );
                    res.status(200).json({ 
                        message: `Incorrect guess. Remaining attempts: ${(this.game.maxAttempts - this.game.attempts)}`,
                        hints: this.game.currentHints
                     });
                    break;
                default:
                    logger.error("Unexpected result from guessWord.");
                    res.status(500).json({ error: "Unexpected result from guessWord" });
                    break;
            }
        } catch (error) {
            logger.error("Error guessing word:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            res.status(500).json({ error: errorMessage });
        }
    }

    askHints(req: SessionRequest, res: Response) {
        const userId = req.session.userId;
        const gameSessionId = req.session.gameSessionId;
        logger.debug(`Asking for hints for user id: ${userId} and game session id: ${gameSessionId}`)

        if (!userId || !gameSessionId) {
            return res.status(400).json({ error: "No active game session. Start a new game first." });
        }

        try {
            const attribute = req.body.attribute;
            const hint = this.gameService.askHints(attribute);

            logger.info(`Hint: ${hint} for attribute: ${attribute}`);
            res.status(200).json({ hint: hint });
        } catch (error) {
            logger.error("Error guessing word:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            res.status(500).json({ error: errorMessage });
        }
    }
}

export default GameController;