import { Game, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import Entity from "./Entity";

interface InvestigationEntityData {
    results: Array<Entity>;
    counter?: number;
    chances?: number;
}

class InvestigationEntity extends Entity {
    results: Array<Entity>;
    counter: number;
    chances: number;

    constructor(data: InvestigationEntityData) {
        super({
            id: 'site_investigation', 
            name: 'site_investigation',
        });
        this.results = data.results;
        this.counter = data.counter || 0;
        this.chances = data.chances || 2;
    }
    
    getInteractions(game: Game): Array<Option> {
        return [{
            text: `调查${this.site.name}`,
            leftText: '💡',
            rightText: `第${this.counter + 1}次`
        }];
    }

    onInteract(game: Game, option: Option): void {
        const site = this.site;
        this.counter++;
        if (this.counter >= this.chances) {
            site.removeEntity(game, this);
        }
        if (test(game.getPlayer().insight)) {
            game.appendText('你似乎察觉到了什么');
            site.removeEntity(game, this);
            site.addEntities(game, this.results, true);
        } else {
            if (this.counter >= this.chances) {
                game.appendText('好像没发现什么，放弃吧');
                game.appendText(`你失去了对${site.name}的兴趣`, 'mutate');
            } else {
                game.appendText('没什么特别的');
            }
        }
    }
}

export default InvestigationEntity;