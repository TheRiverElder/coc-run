import { GameEvent, Game } from "../interfaces/interfaces";
import { test } from "./math";

function testChance(pos: number, eventFn: (game: Game) => GameEvent): (game: Game) => void {
    return function(game: Game) {
        if (test(pos)) {
            game.triggerEvent(eventFn(game));
        }
    };
}

export {
    testChance,
}