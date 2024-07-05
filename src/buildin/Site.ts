import { Game, GameEvent } from "../interfaces/interfaces";
import { Identical, Named } from "../interfaces/types";
import Entity from "./entities/Entity";
import UniqueMap from "./UniqueMap";

interface SiteData extends Identical, Named {
    game: Game;
    entities?: Array<Entity>;
    onEnter?: ((game: Game) => void) | GameEvent;
}

class Site implements Identical, Named {

    static FAKE_SITE = new Site({
        game: null as unknown as Game,
        id: '__fake_site__',
        name: 'Fake Site',
        entities: [],
    });
    
    readonly game: Game;
    readonly id: string;
    name: string;
    readonly entities: UniqueMap<Entity> = new UniqueMap<Entity>();

    private onEnterFn: ((game: Game) => void) | GameEvent | null;
    
    constructor(data: SiteData) {
        this.game = data.game;
        this.id = data.id;
        this.name = data.name;
        this.onEnterFn = data.onEnter || null;
        data.entities?.forEach(e => {
            this.entities.add(e);
            e.site = this;
        });
    }

    onEnter(): void {
        if (this.onEnterFn) {
            if (typeof this.onEnterFn === 'function') {
                this.onEnterFn(this.game);
            } else {
                this.game.triggerEvent(this.onEnterFn);
            }
        }
    }

    addEntity(entity: Entity, silent: boolean = false): Site {
        this.entities.add(entity);
        if (entity.site !== this) {
            entity.site = this;
            if (!silent) {
                this.entities.values().forEach(e => e.onDetect(entity, this));
            }
        }
        return this;
    }

    addEntities(entities: Array<Entity>, silent: boolean = false): Site {
        entities.forEach(e => this.addEntity(e, silent));
        return this;
    }

    removeEntity(entity: Entity): Site {
        this.entities.remove(entity.uid);
        entity.site = Site.FAKE_SITE;
        return this;
    }

    removeEntities(entities: Array<Entity>): Site {
        entities.forEach(e => this.removeEntity(e));
        return this;
    }

}

export default Site;
export type {
    SiteData,
}