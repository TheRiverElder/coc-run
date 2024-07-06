import { Option } from "../../interfaces/interfaces";
import { Subopt } from "../../interfaces/types";
import ObjectBase, { ObjectBaseData } from "../objects/ObjectBase";
import Site from "../Site";

interface EntityData extends ObjectBaseData {
    site?: Site;
}

abstract class Entity extends ObjectBase {

    private _site: Site | null;
    public get site(): Site {
        if (!this._site) throw new Error("Site not set!");
        return this._site;
    }

    constructor(data: EntityData) {
        super(data);
        this._site = data.site ?? null;
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
        this._site = newSite;
    }

    /**
     * @depratured
     */
    onInteract(option: Option, subopt: Subopt | null): void {
        // if (option.tag === this.uid) {
        //     game.appendText(this.name);
        // }
    }

    /**
     * @depratured
     */
    onDetect(entity: Entity, site: Site) {
        // empty
    }

    // 把自己从场景中移除，此行为不会解除entity对site的引用
    removeSelf() {
        this.site.removeEntity(this);
        this._site = null;
    }
}

export default Entity;
export type {
    EntityData,
}