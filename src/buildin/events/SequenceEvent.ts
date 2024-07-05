import { Game, GameEvent, Option } from "../../interfaces/interfaces";
import { GameEventData } from "../GameEvent";

interface SequenceEventData extends GameEventData {
    events: Array<GameEvent>;
    joints?: Array<Option>;
}

class SequenceEvent extends GameEvent {
    events: Array<GameEvent>;
    joints: Array<Option>;
    pointer: number = 0;

    constructor(data: SequenceEventData) {
        super({
            ...data,
            priority: 0,
        });
        this.events = data.events;
        this.joints = Array(this.events.length - 1).fill(0).map((_, i) => data.joints?.[i] || { text: '...' });
    }

    nextEvent() {
        if (this.pointer >= this.events.length) {
            this.game.endEvent(this);
            return;
        }
        const ce = this.events[this.pointer++];
        this.game.triggerEvent(ce);
    }

    override onStart() {
        this.nextEvent();
    }

    override onRender(): Array<Option> {
        return [this.joints[this.pointer - 1]];
    }

    override onInput(option: Option): void {
        this.nextEvent();
    }
}

export default SequenceEvent;
export type {
    SequenceEventData,
}