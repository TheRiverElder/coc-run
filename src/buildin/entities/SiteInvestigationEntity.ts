import { Game, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import Entity from "./Entity";

interface SiteInvestigationEntityData {
    results: Array<Entity>;
    counter?: number;
    chances?: number;
}

class SiteInvestigationEntity extends Entity {
    results: Array<Entity>;
    counter: number;
    chances: number;

    constructor(data: SiteInvestigationEntityData) {
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
            rightText: `第${this.counter + 1}次`
        }];
    }

    onInteract(option: Option, game: Game): void {
        const site = this.site;
        this.counter++;
        if (this.counter >= this.chances) {
            site.removeEntity(this, game);
        }
        if (test(game.getPlayer().insight)) {
            game.appendText('你似乎察觉到了什么');
            site.removeEntity(this, game);
            site.addEntities(this.results, game, true);
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

export default SiteInvestigationEntity;