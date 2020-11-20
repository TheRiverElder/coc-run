import { Game, GameEvent, Option } from "../../interfaces/interfaces";

interface SequenceEventData {
    events: Array<GameEvent>;
    joints?: Array<Option>;
}

class SequenceEvent extends GameEvent {
    events: Array<GameEvent>;
    joints: Array<Option>;
    pointer: number = 0;

    constructor(data: SequenceEventData) {
        super({
            id: 'sequence',
            priority: 0,
        });
        this.events = data.events;
        this.joints = Array(this.events.length - 1).fill(0).map((_, i) => data.joints?.[i] || { text: '...' });
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
        return [this.joints[this.pointer - 1]];
    }

    onInput(option: Option, game: Game): void {
        this.nextEvent(game);
    }
}

export default SequenceEvent;
export type {
    SequenceEventData,
}