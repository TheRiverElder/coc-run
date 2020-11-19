import { Game, Option } from "../../interfaces/interfaces";
import Entity from "./Entity";
import Site from "../Site";

interface PortEntityData {
    site?: Site;
    target: string;
}

class PortEntity extends Entity {
    target: string;

    constructor({ target, site }: PortEntityData) {
        super({
            id: 'port', 
            name: target,
            site,
        });
        this.target = target;
    }
    
    getInteractions(game: Game) {
        return [{
            text: '去往' + (game.getMap().get(this.target)?.name || '#ERROR#'),
            tag: this.uid,
        }];
    }

    onInteract(option: Option, game: Game) {
        if (option.tag === this.uid) {
            const site = game.getMap().get(this.target);
            if (site) {
                game.getPlayer().goToSite(site, game);
            }
        }
    }
}

export default PortEntity;
export type {
    PortEntityData,
}