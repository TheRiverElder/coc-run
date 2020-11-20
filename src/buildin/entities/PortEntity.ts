import { Game, Option } from "../../interfaces/interfaces";
import Entity from "./Entity";
import Site from "../Site";

interface PortEntityData {
    site?: Site;
    target: string;
    timeCost?: number;
}

class PortEntity extends Entity {
    target: string;
    timeCost: number;

    constructor({ target, site, timeCost }: PortEntityData) {
        super({
            id: 'port', 
            name: target,
            site,
        });
        this.target = target;
        this.timeCost = timeCost || 1;
    }
    
    getInteractions(game: Game) {
        return [{
            text: '去往' + (game.getMap().get(this.target)?.name || '#ERROR#'),
            leftText: (game.getPlayer().prevSite?.id === this.target) ? '⬅' : '➡',
            tag: this.uid,
        }];
    }

    onInteract(option: Option, game: Game) {
        if (option.tag === this.uid) {
            const site = game.getMap().get(this.target);
            if (site) {
                game.getPlayer().goToSite(site, game);
                game.timePass(this.timeCost);
            }
        }
    }
}

export default PortEntity;
export type {
    PortEntityData,
}