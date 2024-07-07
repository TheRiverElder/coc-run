import { Option } from "../../interfaces/types";
import { test } from "../../utils/math";
import Entity from "../entities/Entity";
import ItemEntity from "../entities/ItemEntity";
import Item from "../items/Item";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";

export type DiscoverListener = (clue: ClueComponent, times: number) => void;

export interface ClueComponentData extends ComponentBaseData {
    counter?: number; // 已经调查过的次数
    chances?: number; // 总共能调查几次
    onDiscover: DiscoverListener; // 调查结果，times: 第几次成功调查的结果，从0开始
}

export default class ClueComponent extends ComponentBase {

    public static readonly ID = "clue";

    override get id(): string {
        return ClueComponent.ID;
    }

    counter: number; // 已经调查过的次数
    chances: number; // 总共能调查几次
    onDiscover: DiscoverListener; // 调查结果
    private times = 0;

    constructor(data: ClueComponentData) {
        super(data);

        this.counter = data.counter ?? 0;
        this.chances = data.chances ?? 2;
        this.onDiscover = data.onDiscover;
    }

    override getInteractions(): Option[] {
        if (this.counter >= this.chances) return [];

        return [{
            text: `调查`,
            leftText: '💡',
            rightText: `第${this.counter + 1}次`,
            action: () => {
                const succeeded = test(this.game.getPlayer().insight);
                if (succeeded) {
                    this.game.appendText('你似乎察觉到了什么');
                    this.onDiscover(this, this.times);
                    this.times++;
                } else {
                    if (this.counter >= this.chances) {
                        this.game.appendText('好像没发现什么，放弃吧');
                        this.game.appendText(`你失去了对的兴趣`, 'mutate');
                    } else {
                        this.game.appendText('没什么特别的');
                    }
                }
            },
        }];

    }

}

/**
 * 将线索按顺序给出
 * @param clues 要按顺序给出的线索
 * @returns DiscoverListener
 */
export function createSequentialClues(clues: Array<(clue: ClueComponent) => void>): DiscoverListener {
    return (clue: ClueComponent, times: number) => clues[times]?.(clue);
}

/**
 * 封装物品线索
 * @param item 发现的物品
 * @param autoPick 是否直接拾起
 * @returns DiscoverListener
 */
export function createItemClue(item: Item, autoPick: boolean = false): DiscoverListener {
    return (clue: ClueComponent) => {
        const host = clue.host;
        if (autoPick) {
            clue.game.getPlayer().addItemToInventory(item);
        } else if (host instanceof Entity) {
            host.site.addEntity(new ItemEntity({ item }));
        } else if (host instanceof Item) {
            clue.game.getPlayer().addItemToInventory(item);
        }
    };
}

/**
 * 封装实体线索
 * @param entity 发现的实体
 * @returns DiscoverListener
 */
export function createEntityClue(entity: Entity): DiscoverListener {
    return (clue: ClueComponent) => {
        const host = clue.host;
        if (host instanceof Entity) {
            host.site.addEntity(entity);
        }
    };
}