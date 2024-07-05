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

    mutateValue(key: string, delta: number, reason?: string): void {
        switch (key) {
            case 'health': this.health += delta; break;
            case 'strength': this.strength += delta; break;
            case 'dexterity': this.dexterity += delta; break;
        }
        this.game.appendText(`${this.name} ${reason || ''} ${this.game.translate(key)} ${num2strWithSign(delta)}`);
        if (this.health <= 0) {
            this.game.appendText(`${this.name}死亡`);
            this.site.addEntities(this.loots);
            this.site.removeEntity(this);
        }
    }

    onCombatStart(combat: CombatEvent, self: CombatEntity) {
        // empty
    }

    onCombatTurn(combat: CombatEvent, self: CombatEntity) {
        // empty
    }

    onCombatEnd(combat: CombatEvent, self: CombatEntity) {
        // empty
    }

    attack(target: LivingEntity, isFightBack: boolean = false): Damage {
        const weapon = this.getWeapon();
        const damage: Damage = weapon.onAttack(target);
        this.onAttack(damage, target);
        if (damage.value) {
            target.onReceiveDamage(damage, this, isFightBack);
        }
        return damage;
    }

    onAttack(damage: Damage, target: LivingEntity): void {
        // empty
    }

    onReceiveDamage(damage: Damage, source: LivingEntity, isFightBack: boolean = false) {
        if (!isFightBack) {
            if (test(this.dexterity)) {
                const s = `${this.name}躲过了${source.name}的进攻`;
                if (test(this.dexterity)) {
                    this.game.appendText(s + `，并返回打一把`, 'good');
                    this.attack(source, true);
                } else {
                    this.game.appendText(s, 'good');
                }
                return;
            }
        }
        damage.value = Math.max(0, damage.value - this.shield);
        if (damage.value) {
            this.mutateValue('health', -damage.value, `受到${source.name}攻击`);
        } else {
            this.game.appendText(`${this.name}的护甲防住了${source.name}的攻势`, 'good');
        }
    }

    goToSite(newSite: Site, silent: boolean = false): void {
        this.game.appendText(`${this.name}来到了${newSite.name}`, 'mutate');
        super.goToSite(newSite, silent);
    }

    getWeapon(): Item {
        return new MeleeWeapon({
            game: this.game,
            id: 'melee',
            name: this.baseWeaponName,
            damage: this.baseDamage,
        });
    }

    isAlive(): boolean {
        return this.health > 0;
    }

    removeSelf(): boolean {
        if (this.site !== Site.FAKE_SITE) {
            this.site.removeEntity(this);
            return true;
        }
        return false;
    }
}