import { Entity } from "../../interfaces/interfaces";
import Item from "../items/Item";
import ItemEntity from "./ItemEntity";
import HoldComponent from "../components/HoldComponent";
import HealthComponent from "../components/HealthComponent";
import CombatableComponent from "../components/CombatableComponent";
import EmptyCombatAI from "../CombatAI/EmptyCombatAI";
import { Hands } from "../Hands";
import { EntityData } from "./Entity";

export interface CombatableEntityData extends EntityData {
    health?: number;
    maxHealth: number;
    shield?: number;
    dexterity: number;
    magic?: number;
    defaultWeapon: Item;
    holdingItem?: Item;
}

export default class CombatableEntity extends Entity {

    magic: number;

    readonly living: HealthComponent;
    readonly hands: HoldComponent;
    readonly combatable: CombatableComponent;

    constructor(data: CombatableEntityData) {
        super(data);

        this.magic = data.magic ?? 0;

        this.living = new HealthComponent({ health: data.health, maxHealth: data.maxHealth });
        this.hands = new HoldComponent({ holderSize: 1, heldItems: [data.holdingItem ?? null] });
        this.combatable = new CombatableComponent({
            dexterity: data.dexterity,
            defaultWeapon: data.defaultWeapon,
            combatAI: new EmptyCombatAI(),
            shield: data.shield,
        });

        this.addComponent(this.living);
        this.addComponent(this.hands);
        this.addComponent(this.combatable);
    }
}

/**
 * 'drop'代表变为掉落物
 * 'restore'代表收回到背包
 * 'delete'表示直接删除
 */
export type ReplaceOption = 'drop' | 'restore' | 'delete';