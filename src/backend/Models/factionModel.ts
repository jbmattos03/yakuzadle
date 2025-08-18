import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Database/database";

class FactionModel extends Model {
    // Using ! to indicate that these fields will be initialized later with Sequelize
    public id!: number;
    public name!: string;
    public leaderId!: number // References a Character's id

    static associate(models: any) {
        this.hasMany(models.CharacterToFactionModel, {
            foreignKey: {
                name: "factionId",
                allowNull: false, // Faction must have characters
            },
            onDelete: "CASCADE", // If a faction is deleted, all associated characters will also be deleted
            onUpdate: "CASCADE", // If a faction is updated, all associated characters will also be updated
            as: "characters"
        });
    }
}

FactionModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leader: {
        type: DataTypes.STRING,
        allowNull: false, // Leader must be defined
    }
}, {
    sequelize,
    modelName: "Faction",
    tableName: "Faction",
    timestamps: true, // Enable createdAt and updatedAt fields
});

export default FactionModel;