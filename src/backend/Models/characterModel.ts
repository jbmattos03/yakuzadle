import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Database/database";

enum Gender {
    Male = "Male",
    Female = "Female",
    Unknown = "Unknown",
}

enum Role {
    Protagonist = "Protagonist",
    Antagonist = "Antagonist",
    Supporting = "Supporting",
    Mentor = "Mentor",
    Minor = "Minor",
}

class CharacterModel extends Model {
    // Using ! to indicate that these fields will be initialized later with Sequelize
    public id!: number;
    public name!: string;
    public gender!: Gender;
    public role!: Role;
    public tattoo!: string;
    public isPlayable!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Define associations
    static associate(models: any) {
        this.hasMany(models.CharacterToFactionModel, {
            foreignKey: {
                name: "characterId",
                allowNull: false, // Character must be associated with a faction
            },
            onDelete: "CASCADE", // If a character is deleted, all associated factions will also be deleted
            onUpdate: "CASCADE", // If a character is updated, all associated factions will also be updated
            as: "factions"
        });

        this.hasMany(models.Skills, {
            foreignKey: {
                name: "characterId",
                allowNull: true, // Character may not have skills
            },
            onDelete: "CASCADE", // If a character is deleted, all associated skills will also be deleted
            onUpdate: "CASCADE", // If a character is updated, all associated skills will also be updated
            as: "skills"
        });
    }
}

// Initialize the CharacterModel with the sequelize instance
CharacterModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM(...Object.values(Gender)),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(...Object.values(Role)),
        allowNull: false,
    },
    tattoo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPlayable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: "Character",
    tableName: "Character",
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default CharacterModel;