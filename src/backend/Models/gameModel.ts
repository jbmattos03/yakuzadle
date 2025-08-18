import CharacterModel from "./characterModel";

enum Status {
    NotStarted = "Not Started",
    InProgress = "In Progress",
    Completed = "Completed",
    Failed = "Failed",
}
class GameModel {
    public status: Status = Status.NotStarted;
    public wordToGuess: string = ""; // The word that needs to be guessed
    public guessedWords: string[] = [];
    public currentHints: { [key: string]: boolean } = {}; // Hints for the current game
    public attempts: number = 0;
    public maxAttempts: number = 6;
    public character: CharacterModel | null = null; // The character associated with the game
    public characterDetails: { [key: string]: string } = {};
}

export { Status, GameModel };