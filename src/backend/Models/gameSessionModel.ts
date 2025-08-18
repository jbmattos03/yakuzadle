import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Database/database";
import { Status } from "./gameModel";

class GameSessionModel extends Model {
    // Using ! to indicate these fields will be initialized later with Sequelize
    id!: number;
    gameStatus!: Status;
    isActive!: true

    static associate(models: any) {
        this.belongsTo(models.UserModel, {
            foreignKey: {
                name: "userId",
                allowNull: false // GameSession must be associated with a user
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            as: "user"
        })
    }
}

GameSessionModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gameStatus: {
        type: DataTypes.ENUM(...Object.values(Status)),
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: "User",
            key: "id"
        }
    }
}, {
    sequelize,
    modelName: "GameSession",
    tableName: "GameSession",
    timestamps: true
})

export default GameSessionModel;
