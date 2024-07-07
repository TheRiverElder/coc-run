import { Entity } from "../../interfaces/interfaces";
import Item from "../items/Item";
import ItemEntity from "./ItemEntity";
import StorageComponent from "../components/StorageComponent";
import MoveComponent from "../components/MoveComponent";
import HoldComponent from "../components/HoldComponent";
import HealthComponent from "../components/HealthComponent";
import CombatableComponent from "../components/CombatableComponent";
import EmptyCombatAI from "../CombatAI/EmptyCombatAI";
import { Hands } from "../Hands";
import WeaponComponent from "../components/WeaponComponent";
import { EntityData } from "./Entity";

export interface HumanEntityData extends EntityData {
    health: number;
    maxHealth: number;
    shield?: number;
    dexterity: number;
    name: string;
    magic?: number;
    defaultWeapon: Item;
    holdingItem?: Item;
    inventory?: Array<Item>;
}

export default class HumanEntity extends Entity {

    name: string;

    magic: number;

    readonly living: HealthComponent;
    readonly storage: StorageComponent;
    readonly movement: MoveComponent;
    readonly hands: HoldComponent;
    readonly combatable: CombatableComponent;

    constructor(data: HumanEntityData) {
        super(data);

        this.name = data.name;
        this.magic = data.magic ?? 0;

        this.living = new HealthComponent({ maxHealth: data.maxHealth });
        this.storage = new StorageComponent({ items: data.inventory ?? [], doDisplayMessage: true });
        this.movement = new MoveComponent();
        this.hands = new HoldComponent({ holderSize: 1, heldItems: [data.holdingItem ?? null] });
        this.combatable = new CombatableComponent({
            dexterity: data.dexterity,
            defaultWeapon: data.defaultWeapon,
            combatAI: new EmptyCombatAI(),
        });
    }

    /**
     * 设置主手持的物品
     * @param item 要拿在主手的物品，设为null则不拿物品
     * @param replaceOption 对原来的物品要怎么处理
     */
    holdItem(item: Item | null, replaceOption: ReplaceOption = 'restore'): void {
        const prevItem = this.hands.hold(Hands.MAIN, item);
        if (item) {
            this.storage.remove(item);
            this.game.appendText(`${this.name}拿起了${item.name}`, 'mutate');
        } else if (prevItem) {
            this.game.appendText(`${this.name}收起了${prevItem.name}`, 'mutate');
        }
        if (!prevItem) return;
        switch (replaceOption) {
            case 'drop': this.site.addEntity(new ItemEntity({ item: prevItem })); break;
            case 'restore': this.storage.add(prevItem); break;
            case 'delete': break;
        }
    }

    getItemOnMainHand(): Item | null {
        return this.hands.getHeldItem(Hands.MAIN);
    }

    // holdItem(null, replaceOption) 的简写
    unholdItem(replaceOption: ReplaceOption = 'restore') {
        this.holdItem(null, replaceOption);
    }

    addItemToInventory(...items: Array<Item>) {
        this.storage.add(...items);
    }

    removeItemFromInventory(item: Item, replaceOption: 'drop' | 'delete' = 'drop'): boolean {
        const [removedItem] = this.storage.remove(item);
        if (!removedItem) return false;

        switch (replaceOption) {
            case 'drop': this.site.addEntity(new ItemEntity({ item, site: this.site })); break;
            case 'delete': break;
        }
        return true;
    }
}

/**
 * 'drop'代表变为掉落物
 * 'restore'代表收回到背包
 * 'delete'表示直接删除
 */
export type ReplaceOption = 'drop' | 'restore' | 'delete';