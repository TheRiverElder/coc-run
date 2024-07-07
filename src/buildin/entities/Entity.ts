import { Game, GameComponent, Option } from "../../interfaces/interfaces";
import { Subopt } from "../../interfaces/types";
import ObjectBase, { ObjectBaseData } from "../objects/ObjectBase";
import Site from "../Site";

export interface EntityData extends ObjectBaseData {
    site?: Site;
    name?: string;
}

export default class Entity extends ObjectBase {

    public name: string;

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
        this.name = data.name ?? '???';
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

export function createEntityWithComponents(game: Game, ...components: Array<GameComponent>): Entity {
    return new Entity({ game, components });
}