import { Game, Option } from "../interfaces/interfaces";
import { Identical, Unique } from "../interfaces/types";

export interface GameEventData {
    game: Game;
    id?: string;
    priority?: number;
    uid?: number;
}

export default class GameEvent {
    readonly game: Game;
    readonly uid: number;
    id: string;
    priority: number;

    constructor(data: GameEventData) {
        this.game = data.game;
        this.uid = data.uid || this.game.generateUid();
        this.id = data.id ?? "unknown";
        this.priority = data.priority || 0;
    }

    onStart(): void { }

    onRender(): Array<Option> {
        return [];
    }

    onEnd(): void { }

    endSelf() {
        this.game.endEvent(this);
    }
}