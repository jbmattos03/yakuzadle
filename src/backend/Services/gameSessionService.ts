import GameSessionModel from "../Models/gameSessionModel";
import { Status } from "../Models/gameModel";
import logger from "../Utils/logger";

class GameSessionService {
    static async findAllGameSessionsByUser(userId: number): Promise<GameSessionModel[] | null> {
        try {
            const gameSessions = await GameSessionModel.findAll({ where: { userId: userId } });
            if (!gameSessions || gameSessions.length === 0) {
                logger.warn(`No game sessions found for user id ${userId}`)
                return null;
            }

            return gameSessions;
        } catch (error) {
            logger.error(`Error fetching game sessions for user with user id ${userId}: ${error}`);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(errorMessage);
        }
    }

    static async createGameSession(userId: number, gameStatus: Status): Promise<GameSessionModel> {
        try {
            const gameSession = await GameSessionModel.create({ 
                userId: userId,
                gameStatus: gameStatus,
                isActive: true
            });

            return gameSession;
        } catch (error) {
            logger.error("Error creating game session: ", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(errorMessage);
        }
    }

    static async updateGameSession(gameSessionId: number, gameStatus: Status, isActive: boolean): Promise<GameSessionModel | null> {
        try {
            const gameSession = GameSessionModel.findByPk(gameSessionId);
            if (!gameSession) {
                logger.error(`Game session with id ${gameSessionId} does not exist`)
                throw new Error("No game sessions found")
            }

            await GameSessionModel.update(
                { gameStatus: gameStatus, isActive: isActive },
                { where: { id: gameSessionId } }
            );
            const updatedGameSession = GameSessionModel.findByPk(gameSessionId);

            return updatedGameSession;
        } catch (error) {
            logger.error("Error updating game session: ", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(errorMessage);
        }
    }

    static async findLatestActiveSessionForUser(userId: number): Promise<GameSessionModel | null> {
        try {
            const latestGameSession = await GameSessionModel.findOne({
                where: { userId: userId, isActive: true },
                order: [['createdAt', 'DESC']]
            });
            if (!latestGameSession) {
                logger.warn(`No active game sessions found for user id ${userId}`);
                return null;
            }

            return latestGameSession;
        } catch (error) {
            logger.error(`Error fetching latest game session for user ${userId}`);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(errorMessage);
        }
    }
}

export default GameSessionService;