import { Game, Option } from "../interfaces/interfaces";
import { Identical, Subopt, Unique } from "../interfaces/types";
import { genUid } from "../utils/math";

export interface GameEventData {
    game: Game;
    id?: string;
    priority?: number;
    uid?: number;
}

export default class GameEvent implements Identical, Unique {
    readonly game: Game;
    id: string;
    priority: number;
    uid: number;

    constructor(data: GameEventData) {
        this.game = data.game;
        this.id = data.id ?? "unknown";
        this.priority = data.priority || 0;
        this.uid = data.uid || genUid();
    }

    onStart(): void {
        this.game.appendText(`事件[${this.id}]开始了`);
    }

    onRender(): Array<Option> {
        return [];
    }

    onInput(option: Option, subopt: Subopt | null): void {
        this.game.appendText(`来自事件[${this.id}]`);
    }
}