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
    public set site(site: Site) {
        this._site = site;
    }

    constructor(data: EntityData) {
        super(data);
        this._site = data.site ?? null;
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

    // 把自己从场景中移除
    removeSelf() {
        this._site?.removeEntity(this);
        this._site = null;
    }
}

export default Entity;
export type {
    EntityData,
}