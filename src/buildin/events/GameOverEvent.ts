import { Game, GameEvent } from "../../interfaces/interfaces";
import { GameEventData } from "../GameEvent";

export interface GameOverEventData extends GameEventData {
    reason: string;
}

export default class GameOverEvent extends GameEvent {
    reason: string;

    constructor(data: GameOverEventData) {
        super({
            ...data,
            id: 'game_over',
            priority: 10,
        });
        this.reason = data.reason;
    }

    onStart() {
        this.game.gameOver(this.reason);
    }
}