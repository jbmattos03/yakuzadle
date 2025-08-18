import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Database/database";

class CharacterToFactionModel extends Model {
    static associate(models: any) {
        this.belongsTo(models.CharacterModel, {
            foreignKey: {
                name: "characterId",
                allowNull: false, // Character must be associated with a faction
            },
            onDelete: "CASCADE", // If a character is deleted, all associations will also be deleted
            onUpdate: "CASCADE", // If a character is updated, all associations will also be updated
            as: "character"
        });

        this.belongsTo(models.FactionModel, {
            foreignKey: {
                name: "factionId",
                allowNull: false, // Faction must have characters
            },
            onDelete: "CASCADE", // If a faction is deleted, all associations will also be deleted
            onUpdate: "CASCADE", // If a faction is updated, all associations will also be updated
            as: "faction"
        });
    }
}

CharacterToFactionModel.init({
    characterId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false, // Character must be defined
    },
    factionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false, // Faction must be defined
    }
}, {
    sequelize,
    modelName: "CharacterToFaction",
    tableName: "CharacterToFaction",
    timestamps: false, // No createdAt or updatedAt fields needed for this association
});

export default CharacterToFactionModel;