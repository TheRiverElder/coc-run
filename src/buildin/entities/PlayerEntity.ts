import { Option, Site } from "../../interfaces/interfaces";
import LivingEntity, { LivingEntityData } from "./LivingEntity";
import Item from "../items/Item";
import ItemEntity from "./ItemEntity";
import { num2strWithSign } from "../../utils/strings";
import StorageComponent from "../components/StorageComponent";
import MoveComponent from "../components/MoveComponent";
import HoldComponent from "../components/HoldComponent";
import HealthComponent from "../components/HealthComponent";
import CombatableComponent from "../components/CombatableComponent";
import EmptyCombatAI from "../CombatAI/EmptyCombatAI";
import { Hands } from "../Hands";

export interface PlayerEntityData extends LivingEntityData {
    name: string;
    money: number;
    magic: number;
    insight: number;
    defaultWeapon: Item;
    holdingItem?: Item;
    inventory?: Array<Item>;
}

export default class PlayerEntity extends LivingEntity {

    name: string;

    money: number;
    magic: number;
    insight: number;

    defaultWeapon: Item;

    readonly living: HealthComponent;
    readonly storage: StorageComponent;
    readonly movement: MoveComponent;
    readonly hands: HoldComponent;
    readonly combatable: CombatableComponent;

    constructor(data: PlayerEntityData) {
        super(data);

        this.name = data.name;
        this.money = data.money;
        this.magic = data.magic;
        this.insight = data.insight;

        this.defaultWeapon = data.defaultWeapon;

        this.living = new HealthComponent({ maxHealth: data.maxHealth });
        this.storage = new StorageComponent({ items: data.inventory ?? [], doDisplayMessage: true });
        this.movement = new MoveComponent();
        this.hands = new HoldComponent({ holderSize: 1, heldItems: [data.holdingItem ?? null] });
        this.combatable = new CombatableComponent({
            dexterity: data.dexterity,
            baseDamage: data.baseDamage,
            combatAI: new EmptyCombatAI(),
        });
    }

    mutateValue(key: string, delta: number, reason?: string): void {
        switch (key) {
            case 'health': this.health += delta; break;
            case 'magic': this.magic += delta; break;
            case 'money': this.money += delta; break;
            case 'strength': this.strength += delta; break;
            case 'insight': this.insight += delta; break;
            case 'dexterity': this.dexterity += delta; break;
        }
        this.game.appendText(`${this.name} ${reason || ''} ${this.game.translate(key)} ${num2strWithSign(delta)}`);
        if (!this.isAlive()) {
            this.game.gameOver('失血过多');
        }
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

    // holdItem(null, replaceOption) 的简写
    unholdItem(replaceOption: ReplaceOption = 'restore') {
        this.holdItem(null, replaceOption);
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

    getWeapon(): WeaponComponent {
        const heldWeapon = this.hands.getHeldItem(Hands.MAIN)?.tryGetComponent(WeaponComponent.ID);
        if (heldWeapon) return heldWeapon;
        return this.defaultWeapon.gtComponent(WeaponComponent.ID);
    }

    getInteractions(): Array<Option> {
        return [];
    }
}

/**
 * 'drop'代表变为掉落物
 * 'restore'代表收回到背包
 * 'delete'表示直接删除
 */
export type ReplaceOption = 'drop' | 'restore' | 'delete';