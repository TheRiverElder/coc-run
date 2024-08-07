import { GameEvent, Option } from "../../interfaces/interfaces";
import Entity from "./Entity";

export interface EventTriggerEntityData {
    event: GameEvent;
    option?: Option;
    once?: boolean; 
}

export default class EventTriggerEntity extends Entity {

    event: GameEvent;
    option: Option;
    once: boolean; 

    constructor(data: EventTriggerEntityData) {
        super({
            game: data.event.game,
        });
        this.event = data.event;
        this.option = data.option || { text: '...' };
        this.once = data.once || true;
    }
    
    override getInteractions() {
        return [this.option];
    }

    override onInteract(option: Option) {
        this.game.triggerEvent(this.event);
        if (this.once) {
            this.site.removeEntity(this);
        }
    }
}