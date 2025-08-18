import UserModel from "../Models/userModel";
import logger from "../Utils/logger";

class UserService {
    static async findUserBySessionId(sessionId: number): Promise<UserModel | null> {
        try {
            const user = await UserModel.findOne({ where: { sessionId: sessionId } });
            if (!user) {
                logger.warn(`No user found for session id ${sessionId}`)
                return null;
            }

            return user;
        } catch (error) {
            logger.error("Error fetching user: ", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(errorMessage);
        }
    }

    static async createUser(sessionId: number): Promise<UserModel> {
        try {
            const user = await this.findUserBySessionId(sessionId);
            if (user) {
                logger.error(`User with session id ${sessionId} already exists`)
                throw new Error("User already exists")
            }

            const newUser = await UserModel.create({ sessionId: sessionId });
            return newUser;
        } catch (error) {
            logger.error("Error creating user: ", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error has occurred";
            throw new Error(errorMessage);
        }
    }
}

export default UserService;