import { Game, GameEvent, Option, Text } from "../../interfaces/interfaces";

interface SequenceEventData {
    events: Array<GameEvent>;
}

class SequenceEvent extends GameEvent {
    events: Array<GameEvent>;
    pointer: number = 0;

    constructor(data: SequenceEventData) {
        super({
            id: 'sequence',
            priority: 0,
        });
        this.events = data.events;
    }

    nextEvent(game: Game) {
        if (this.pointer >= this.events.length) {
            game.endEvent(this);
            return;
        }
        const ce = this.events[this.pointer++];
        game.triggerEvent(ce);
    }

    onStart(game: Game) {
        this.nextEvent(game);
    }

    onRender(game: Game): Array<Option> {
        return [{ text: '...' }];
    }

    onInput(option: Option, game: Game): void {
        this.nextEvent(game);
    }
}

export default SequenceEvent;
export type {
    SequenceEventData,
}