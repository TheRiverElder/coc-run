import { Game, GameEvent, Option } from "../../interfaces/interfaces";
import Entity from "./Entity";

interface EventTriggerEntityData {
    event: GameEvent;
    option?: Option;
    once?: boolean; 
}

class EventTriggerEntity extends Entity {
    event: GameEvent;
    option: Option;
    once: boolean; 

    constructor({ event, once, option }: EventTriggerEntityData) {
        super({
            id: 'event_trigger', 
            name: event.id,
        });
        this.event = event;
        this.option = option || { text: '...' };
        this.once = once || true;
    }
    
    getInteractions(game: Game) {
        return [this.option];
    }

    onInteract(game: Game, option: Option) {
        game.triggerEvent(this.event);
        if (this.once) {
            this.site.removeEntity(game, this);
        }
    }
}

export default EventTriggerEntity;
export type {
    EventTriggerEntityData,
}