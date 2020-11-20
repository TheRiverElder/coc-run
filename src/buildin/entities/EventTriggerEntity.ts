import { Game, GameEvent, Site } from "../../interfaces/interfaces";
import Entity from "./Entity";

interface EventTriggerEntityData {
    event: GameEvent;
}

class EventTriggerEntity extends Entity {
    event: GameEvent;

    constructor({ event }: EventTriggerEntityData) {
        super({
            id: 'event_trigger', 
            name: event.id,
        });
        this.event = event;
    }
    
    getInteractions(game: Game) {
        return [];
    }

    onDetect(entity: Entity, site: Site, game: Game) {
        if (entity.id === 'player') {
            game.triggerEvent(this.event);
            site.removeEntity(this, game);
        }
    }
}

export default EventTriggerEntity;
export type {
    EventTriggerEntityData,
}