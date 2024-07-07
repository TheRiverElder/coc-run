import { CombatEvent, Damage, Dice, Game, Item, ItemEntity, MeleeWeapon, Site } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import { num2strWithSign } from "../../utils/strings";
import { CombatEntity } from "../events/CombatEvent";
import Entity, { EntityData } from "./Entity";

export interface LivingEntityData extends EntityData {
    name?: string;
    health: number;
    maxHealth: number;
    shield?: number;
    strength: number;
    dexterity: number;
    baseDamage: Dice | number;
    baseWeaponName: string;
    loots?: Array<Entity | Item>;
}

export default abstract class LivingEntity extends Entity {

    name: string;

    health: number;
    maxHealth: number;
    shield: number;
    strength: number;
    dexterity: number;
    baseDamage: Dice | number;
    baseWeaponName: string; // 基础武器的名字，不同实体的武器是不一样的
    loots: Array<Entity>;

    constructor(data: LivingEntityData) {
        super(data);

        this.name = data.name ?? "???";
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.shield = data.shield ?? 0;LivingEntity
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.baseDamage = data.baseDamage;
        this.baseWeaponName = data.baseWeaponName;
        this.loots = data.loots?.map(e => e instanceof Item ? new ItemEntity({ item: e }) : e) ?? [];
    }
}