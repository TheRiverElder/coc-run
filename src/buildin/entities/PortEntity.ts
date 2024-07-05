import { Game, Option } from "../../interfaces/interfaces";
import Entity, { EntityData } from "./Entity";
import Site from "../Site";

interface PortEntityData extends EntityData {
    site?: Site;
    target: string;
    timeCost?: number;
}

class PortEntity extends Entity {

    get name(): string {
        return '去往' + (this.game.getMap().get(this.target)?.name || '#ERROR#');
    }

    target: string;
    timeCost: number;

    constructor(data: PortEntityData) {
        super(data);
        this.target = data.target;
        this.timeCost = data.timeCost || 1;
    }
    
    override getInteractions(): Array<Option> {
        return [{
            text: this.name,
            leftText: (this.game.getPlayer().prevSite?.id === this.target) ? '⬅' : '➡',
            tag: this.uid,
            action: () => {
                const site = this.game.getMap().get(this.target);
                if (site) {
                    this.game.getPlayer().goToSite(site);
                    this.game.timePass(this.timeCost);
                }
            }
        }];
    }

    override onInteract(option: Option) {
        if (option.tag === this.uid) {
            const site = this.game.getMap().get(this.target);
            if (site) {
                this.game.getPlayer().goToSite(site);
                this.game.timePass(this.timeCost);
            }
        }
    }
}

export default PortEntity;
export type {
    PortEntityData,
}