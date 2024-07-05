import { Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import Entity, { EntityData } from "./Entity";

interface InvestigationEntityData extends EntityData {
    results: Array<Entity>; // 调查结果
    counter?: number; // 已经调查过的次数
    chances?: number; // 总共能调查几次
}

class InvestigationEntity extends Entity {

    get name(): string {
        throw new Error("Method not implemented.");
    }

    results: Array<Entity>;
    counter: number;
    chances: number;

    constructor(data: InvestigationEntityData) {
        super(data);
        this.results = data.results;
        this.counter = data.counter ?? 0;
        this.chances = data.chances ?? 2;
    }
    
    override getInteractions(): Array<Option> {
        return [{
            text: `调查${this.site.name}`,
            leftText: '💡',
            rightText: `第${this.counter + 1}次`
        }];
    }

    override onInteract(option: Option): void {
        const site = this.site;
        this.counter++;
        if (this.counter >= this.chances) {
            site.removeEntity(this);
        }
        if (test(this.game.getPlayer().insight)) {
            this.game.appendText('你似乎察觉到了什么');
            site.removeEntity(this);
            site.addEntities(this.results, true);
        } else {
            if (this.counter >= this.chances) {
                this.game.appendText('好像没发现什么，放弃吧');
                this.game.appendText(`你失去了对${site.name}的兴趣`, 'mutate');
            } else {
                this.game.appendText('没什么特别的');
            }
        }
    }
}

export default InvestigationEntity;