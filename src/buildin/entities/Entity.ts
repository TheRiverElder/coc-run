import { Game, GameComponent, Option } from "../../interfaces/interfaces";
import { SubOption } from "../../interfaces/types";
import ObjectBase, { ObjectBaseData } from "../objects/ObjectBase";
import Site from "../Site";

export interface EntityData extends ObjectBaseData {
    site?: Site;
}

export default class Entity extends ObjectBase {

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
        this._site = data.site ?? Site.FAKE_SITE;
    }

    // 把自己从场景中移除
    removeSelf() {
        this._site?.removeEntity(this);
        this._site = null;
    }
}

export function createEntityWithComponents(game: Game, ...components: Array<GameComponent>): Entity {
    return new Entity({ game, components });
}