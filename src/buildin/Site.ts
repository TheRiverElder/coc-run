import { Game, GameEvent } from "../interfaces/interfaces";
import { Identical, Named } from "../interfaces/types";
import Entity from "./entities/Entity";
import ObjectBase, { ObjectBaseData } from "./objects/ObjectBase";
import UniqueMap from "./UniqueMap";

interface SiteData extends ObjectBaseData {
    id: string;
    entities?: Array<Entity>;
}

class Site extends ObjectBase {

    static readonly FAKE_SITE = new Site({
        game: { generateUid: () => -1 } as unknown as Game,
        id: '__fake_site__',
        name: 'Fake Site',
        entities: [],
    });
    
    readonly game: Game;
    readonly id: string;
    readonly entities: UniqueMap<Entity> = new UniqueMap<Entity>();
    
    constructor(data: SiteData) {
        super(data);

        this.game = data.game;
        this.id = data.id;
        data.entities?.forEach(e => {
            this.entities.add(e);
            e.site = this;
        });
    }

    addEntity(entity: Entity, silent: boolean = false): Site {
        this.entities.add(entity);
        if (entity.site !== this) {
            entity.site = this;
        }
        return this;
    }

    addEntities(entities: Array<Entity>, silent: boolean = false): Site {
        entities.forEach(e => this.addEntity(e, silent));
        return this;
    }

    removeEntity(...entities: Array<Entity>): Site {
        this.entities.remove(...entities);
        entities.forEach(entity => entity.site = Site.FAKE_SITE);
        return this;
    }

}

export default Site;
export type {
    SiteData,
}