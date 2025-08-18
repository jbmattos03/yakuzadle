import { GameModel, Status } from "../Models/gameModel";
import { sequelize } from "../Database/database";
import CharacterModel from "../Models/characterModel";
import FactionModel from "../Models/factionModel";
import CharacterToFactionModel from "../Models/characterToFactionModel";
import SkillModel from "../Models/skillModel";
import GameSessionModel from "../Models/gameSessionModel";
import UserService from "./userService";
import GameSessionService from "./gameSessionService";
import logger from "../Utils/logger";

enum GuessResponse {
    Correct = "Correct guess",
    Incorrect = "Incorrect guess",
    GameFailed = "Game failed",
}

class GameService {
    game: GameModel;

    constructor() {
        // Instantiate GameModel to manage game state as a property of the service
        this.game = new GameModel();
    }

    async startGame(sessionId: number): Promise<any> {
        this.game.status = Status.InProgress; // Set the game status to InProgress
        this.game.wordToGuess = ""; // Reset the word to guess
        this.game.guessedWords = []; // Reset the guessed words
        this.game.attempts = 0; // Reset the attempts
        this.game.maxAttempts = 6; // Set the maximum attempts

        // Pick a word based on the game mode
        const character = await this.pickWord();
        this.game.character = character;
        const characterDetails = await this.displayCharacterDetails(character);
        this.game.characterDetails = characterDetails;

        logger.debug(`Starting game with character: ${this.game.character.name} and character details: ${JSON.stringify(characterDetails)}`);
        return characterDetails;
    }

    async guessWord(guessedWord: string): Promise<GuessResponse> {
        // Verify if game is in progress
        if (this.game.status !== Status.InProgress) {
            logger.error("Game is not in progress.");
            throw new Error("Game is not in progress.");
        }

        this.game.guessedWords.push(guessedWord);
        this.game.attempts++;

        // Check if the guessed word matches the word to guess
        logger.debug(`Guessed word: ${guessedWord}, Word to guess: ${this.game.wordToGuess}`);
        if (guessedWord === this.game.wordToGuess) {
            this.game.status = Status.Completed;
            logger.info("Game completed with the correct guess.");
            return GuessResponse.Correct; // Game completed successfully
        } else if (this.game.attempts >= this.game.maxAttempts) {
            this.game.status = Status.Failed;
            logger.info("Game failed. Maximum attempts reached.");
            return GuessResponse.GameFailed; // Game failed due to max attempts
        } else {
            this.game.currentHints = await this.hint(guessedWord);
            logger.info(`Incorrect guess. Attempts left: ${this.game.maxAttempts - this.game.attempts}`);
            return GuessResponse.Incorrect; // Game still in progress
        }
    }

    async pickWord(): Promise<CharacterModel> {
        const character = await CharacterModel.findOne({ order: sequelize.random() });
        logger.debug(`Picked character: ${character ? character.name : "None"}`);
        if (!character) {
            logger.error("No characters found in the database.");
            throw new Error("No characters found");
        }
        this.game.character = character; // Set the character for the game
        this.game.wordToGuess = character.name;
        return character;
    }

    async pickSkill(character: CharacterModel): Promise<string | null> {
        const skill = await SkillModel.findOne({ 
            order: sequelize.random(),
            where: { characterId: character.id }
        });
        logger.debug(`Picked skill: ${skill ? skill.name : "None"} for character: ${character.name}`);
        if (!skill) {
            logger.warn(`No skill found for character: ${character.name}`);
            return null; // No skill found for the character
        }
        return skill.name;
    }

    async getSkills(character: CharacterModel): Promise<any> {
        const skills = await SkillModel.findAll({
            where: { characterId: character.id }
        });
        if (!skills || skills.length === 0) {
            logger.warn(`No skills found for character: ${character.name}`);
            return null; // No skills found for the character
        }

        // Fetch skill names for each skill associated with the character
        const skillDetails = skills.map(skill => skill.name);
        return skillDetails;
    }

    async getFactions(character: CharacterModel): Promise<any> {
        const factions = await CharacterToFactionModel.findAll({
            where: { characterId: character.id }
        });
        if (!factions || factions.length === 0) {
            logger.warn(`No factions found for character: ${character.name}`);
            return null; // No factions found for the character
        }

        // Fetch faction details for each factionId associated with the character
        const factionDetails = await Promise.all(
            factions.map(async (aux) => {
            const faction = await FactionModel.findByPk((aux as any).factionId);
            return faction ? faction.name : null;
            })
        );
        return factionDetails;
    }

    async displayCharacterDetails(character: CharacterModel): Promise<any> {
        const characterDetails = {
            gender: character.gender,
            role: character.role,
            tattoo: character.tattoo,
            isPlayable: character.isPlayable,
            skill: await this.pickSkill(character),
            factions: await this.getFactions(character)
        }

        return characterDetails;
    }

    askHints(attribute: string): string | Array<string> {
        switch(attribute) {
            case "Gender":
                return this.game.characterDetails.name;
            case "Role":
                return this.game.characterDetails.role;
            case "Tattoo":
                return this.game.characterDetails.tattoo;
            case "isPlayable":
                return this.game.characterDetails.isPlayable;
            case "Skill":
                return this.game.characterDetails.skill;
            case "Factions":
                return this.game.characterDetails.factions;
            default:
                return "";
        }
    }
    
    async hint(guessedWord: string): Promise<any> {
        const guessedCharacter = await CharacterModel.findOne({ where: { name: guessedWord } });
        if (!guessedCharacter) {
            logger.warn(`No character found with the name: ${guessedWord}`);
            return null; // No character found
        }

        const hints = {
            gender: false,
            role: false,
            tattoo: false,
            isPlayable: false,
            skill: false,
            factions: false,
        };

        // Check if gender is correct
        if (guessedCharacter.gender === this.game.character?.gender) {
            hints.gender = true
        }

        // Check if role is correct
        if (guessedCharacter.role === this.game.character?.role) {
            hints.role = true;
        }

        // Check if tattoo is correct
        if (guessedCharacter.tattoo === this.game.character?.tattoo) {
            hints.tattoo = true;
        }

        // Check if isPlayable is correct
        if (guessedCharacter.isPlayable === this.game.character?.isPlayable) {
            hints.isPlayable = true;
        }

        // Check if skill is correct
        if (this.game.character && guessedCharacter) {
            const [gameSkills, guessedSkills] = await Promise.all([
                this.getSkills(this.game.character),
                this.getSkills(guessedCharacter)
            ]);
            if (JSON.stringify(gameSkills) === JSON.stringify(guessedSkills)) {
                hints.skill = true;
            }
        }

        // Check if factions are correct
        if (this.game.character && guessedCharacter) {
            const [gameFactions, guessedFactions] = await Promise.all([
                this.getFactions(this.game.character),
                this.getFactions(guessedCharacter)
            ]);
            if (JSON.stringify(gameFactions) === JSON.stringify(guessedFactions)) {
                hints.factions = true;
            }
        }
        
        logger.debug(`Hints: ${hints}`);
        return hints; // Return the hints object
    }
}

export default new GameService();
