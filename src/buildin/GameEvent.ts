import { Game, Option } from "../interfaces/interfaces";
import { Identical, Subopt, Unique } from "../interfaces/types";
import { genUid } from "../utils/math";

interface EventData {
    id: string;
    priority?: number;
    uid?: number;
}

class GameEvent implements Identical, Unique {
    id: string;
    priority: number;
    uid: number;

    constructor(data: EventData) {
        this.id = data.id;
        this.priority = data.priority || 0;
        this.uid = data.uid || genUid();
    }

    onStart(game: Game): void {
        game.appendText(`事件[${this.id}]开始了`);
    }

    onRender(game: Game): Array<Option> {
        return [];
    }

    onInput(game: Game, option: Option, subopt: Subopt | null): void {
        game.appendText(`来自事件[${this.id}]`);
    }
}

export default GameEvent;
export type {
    EventData,
}