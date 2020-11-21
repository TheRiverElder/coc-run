import { Game, Option } from "../../interfaces/interfaces";
import { Identical, Named, Unique } from "../../interfaces/types";
import { genUid } from "../../utils/math";
import Site from "../Site";

interface EntityData {
    id?: string;
    uid?: number;
    name: string;
    site?: Site;
}

class Entity implements Identical, Unique, Named {
    id: string;
    uid: number;
    name: string;
    site: Site;

    constructor(data: EntityData) {
        this.id = data.id || 'entity';
        this.uid = data.uid || genUid();
        this.name = data.name;
        this.site = data.site || Site.FAKE_SITE;
    }

    onDetect(game: Game, entity: Entity, site: Site) {
        // empty
    }

    goToSite(game: Game, newSite: Site, silient: boolean = false): void {
        this.site.removeEntity(game, this);
        if (silient) {
            newSite.entities.add(this);
        } else {
            newSite.addEntity(game, this);
        }
        this.site = newSite;
    }

    getInteractions(game: Game): Array<Option> {
        // return [{
        //     text: this.name,
        //     tag: this.uid,
        // }];
        return [];
    }

    onInteract(game: Game, option: Option): void {
        // if (option.tag === this.uid) {
        //     game.appendText(this.name);
        // }
    }
}

export default Entity;
export type {
    EntityData,
}