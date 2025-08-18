import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Database/database";

class UserModel extends Model {
    // Using ! to indicate these fields will be initialized later with Sequelize
    public id!: number;
    public sessionId!: number;

    static associate(models: any) {
        this.hasMany(models.GameSessionModel, {
            foreignKey: {
                name: "userId",
                allowNull: false // GameSession must be associated with a user 
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            as: "games"
        })
    }
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "User",
    timestamps: true
});

export default UserModel;