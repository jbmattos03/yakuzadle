import GameController from "../Controllers/gameController";

const gameController = new GameController();

const gameRoutes = (app: any) => {
    app.get("/", gameController.home.bind(gameController));
    app.get("/start", gameController.startGame.bind(gameController));
    app.post("/guess", gameController.guessWord.bind(gameController));
    app.post("/hint", gameController.askHints.bind(gameController));
}

export default gameRoutes;