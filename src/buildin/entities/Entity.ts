import { Game, Option } from "../../interfaces/interfaces";
import { Identical, Subopt, Unique } from "../../interfaces/types";
import Site from "../Site";

interface EntityData {
    game: Game;
    id?: string;
    uid?: number;
    site?: Site;
}

abstract class Entity implements Identical, Unique {

    readonly game: Game;
    readonly id: string; // 指定了一种类型，之后会用Type系统代替
    readonly uid: number;

    site: Site;

    constructor(data: EntityData) {
        this.game = data.game;
        this.id = data.id || 'entity';
        this.uid = data.uid || this.game.generateUid();
        this.site = data.site || Site.FAKE_SITE;
    }

    /**
     * 走到新的地点
     * @param newSite 要去的新的地点
     * @param silient 如果为true，则不会地点改变的提示文字
     */
    goToSite(newSite: Site, silient: boolean = false): void {
        this.site.removeEntity(this);
        if (silient) {
            newSite.entities.add(this);
        } else {
            newSite.addEntity(this);
        }
        this.site = newSite;
    }

    getInteractions(): Array<Option> {
        // return [{
        //     text: this.name,
        //     tag: this.uid,
        // }];
        return [];
    }

    onInteract(option: Option, subopt: Subopt | null): void {
        // if (option.tag === this.uid) {
        //     game.appendText(this.name);
        // }
    }

    onDetect(entity: Entity, site: Site) {
        // empty
    }
}

export default Entity;
export type {
    EntityData,
}