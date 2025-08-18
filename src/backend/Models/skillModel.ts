import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Database/database";

enum SkillType {
    Move = "Move",
    HeatAction = "Heat Action",
}

class SkillModel extends Model {
    // Using ! to indicate that these fields will be initialized later with Sequelize
    public id!: number;
    public name!: string;
    public description!: string;
    public type!: SkillType;

    static associate(models: any) {
        this.belongsTo(models.CharacterModel, {
            foreignKey: {
                name: "characterId",
                allowNull: false, // Skill must be associated with a character
            },
            onDelete: "CASCADE", // If a character is deleted, all associated skills will also be deleted
            onUpdate: "CASCADE", // If a skill is updated, all associated characters will also be updated
            as: "character"
        });
    }
}

SkillModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Skill must have a name
    },
    type: {
        type: DataTypes.ENUM(SkillType.Move, SkillType.HeatAction),
        allowNull: false, // Skill must have a type
    },
    characterId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Skill must be associated with a character
        references: {
            model: "Character", // Name of the table in the database
            key: "id", // Column in the Character table that this skill references
        }
    }
}, {
    sequelize,
    modelName: "Skill",
    tableName: "Skill",
    timestamps: true, // Enable createdAt and updatedAt fields
})

export default SkillModel;