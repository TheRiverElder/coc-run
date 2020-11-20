import { Game, GameEvent } from "../../interfaces/interfaces";

interface GameOverEventData {
    reason: string;
}

class GameOverEvent extends GameEvent {
    reason: string;

    constructor(data: GameOverEventData) {
        super({
            id: 'game_over',
            priority: 10,
        });
        this.reason = data.reason;
    }

    onStart(game: Game) {
        game.gameOver(this.reason);
    }
}

export default GameOverEvent;
export type {
    GameOverEventData,
}
