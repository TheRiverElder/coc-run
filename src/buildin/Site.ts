import { Game, GameEvent } from "../interfaces/interfaces";
import { Identical, Named } from "../interfaces/types";
import Entity from "./entities/Entity";
import UniqueMap from "./UniqueMap";

interface SiteData extends Identical, Named {
    entities?: Array<Entity>;
    onEnter?: ((game: Game) => void) | GameEvent;
}

class Site implements Identical, Named {

    static FAKE_SITE = new Site({
        id: '__fake_site__',
        name: 'Fake Site',
        entities: [],
    });
    
    id: string;
    name: string;
    entities: UniqueMap<Entity> = new UniqueMap<Entity>();

    private onEnterFn: ((game: Game) => void) | GameEvent | null;
    
    constructor(data: SiteData) {
        this.id = data.id;
        this.name = data.name;
        this.onEnterFn = data.onEnter || null;
        data.entities?.forEach(e => {
            this.entities.add(e);
            e.site = this;
        });
    }

    onEnter(game: Game): void {
        if (this.onEnterFn) {
            if (typeof this.onEnterFn === 'function') {
                this.onEnterFn(game);
            } else {
                game.triggerEvent(this.onEnterFn);
            }
        }
    }

    addEntity(game: Game, entity: Entity, silent: boolean = false): Site {
        this.entities.add(entity);
        if (entity.site !== this) {
            entity.site = this;
            if (!silent) {
                this.entities.values().forEach(e => e.onDetect(game, entity, this));
            }
        }
        return this;
    }

    addEntities(game: Game, entities: Array<Entity>, silent: boolean = false): Site {
        entities.forEach(e => this.addEntity(game, e, silent));
        return this;
    }

    removeEntity(game: Game, entity: Entity): Site {
        this.entities.remove(entity.uid);
        entity.site = Site.FAKE_SITE;
        return this;
    }

    removeEntities(game: Game, entities: Array<Entity>): Site {
        entities.forEach(e => this.removeEntity(game, e));
        return this;
    }

}

export default Site;
export type {
    SiteData,
}