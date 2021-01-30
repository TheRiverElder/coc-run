import { CombatEvent, Damage, Dice, Game, Item, ItemEntity, MeleeWeapon, Site } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import { num2strWithSign } from "../../utils/strings";
import { CombatEntity } from "../events/CombatEvent";
import Entity, { EntityData } from "./Entity";

interface LivingEntityData extends EntityData {
    health: number;
    maxHealth: number;
    shield?: number;
    strength: number;
    dexterity: number;
    baseDamage: Dice | number;
    baseWeaponName: string;
    loots?: Array<Entity | Item>;
}

class LivingEntity extends Entity {
    
    health: number;
    maxHealth: number;
    shield: number;
    strength: number;
    dexterity: number;
    baseDamage: Dice | number;
    baseWeaponName: string;
    loots: Array<Entity>;

    constructor(data: LivingEntityData) {
        super(data);
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.shield = data.shield || 0;
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.baseDamage = data.baseDamage;
        this.baseWeaponName = data.baseWeaponName;
        this.loots = data.loots?.map(e => e instanceof Item ? new ItemEntity({ item: e }) : e) || [];
    }

    mutateValue(game: Game, key: string, delta: number, reason?: string): void {
        switch(key) {
            case 'health': this.health += delta; break;
            case 'strength': this.strength += delta; break;
            case 'dexterity': this.dexterity += delta; break;
        }
        game.appendText(`${this.name} ${reason || ''} ${game.translate(key)} ${num2strWithSign(delta)}`);
        if (this.health <= 0) {
            game.appendText(`${this.name}死亡`);
            this.site.addEntities(game, this.loots);
            this.site.removeEntity(game, this);
        }
    }

    onCombatStart(game: Game, combat: CombatEvent, self: CombatEntity) {
        // empty
    }

    onCombatTurn(game: Game, combat: CombatEvent, self: CombatEntity) {
        // empty
    }

    onCombatEnd(game: Game, combat: CombatEvent, self: CombatEntity) {
        // empty
    }

    attack(game: Game, target: LivingEntity, isFightBack: boolean = false): Damage {
        const weapon = this.getWeapon();
        const damage: Damage = weapon.onAttack(game, target);
        this.onAttack(game, damage, target);
        if (damage.value) {
            target.onReceiveDamage(game, damage, this, isFightBack);
        }
        return damage;
    }

    onAttack(game: Game, damage: Damage, target: LivingEntity): void {
        // empty
    }

    onReceiveDamage(game: Game, damage: Damage, source: LivingEntity, isFightBack: boolean = false) {
        if (!isFightBack) {
            if (test(this.dexterity)) {
                const s = `${this.name}躲过了${source.name}的进攻`;
                if (test(this.dexterity)) {
                    game.appendText(s + `，并返回打一把`, 'good');
                    this.attack(game, source, true);
                } else {
                    game.appendText(s, 'good');
                }
                return;
            }
        }
        damage.value = Math.max(0, damage.value - this.shield);
        if (damage.value) {
            this.mutateValue(game, 'health', -damage.value, `受到${source.name}攻击`);
        } else {
            game.appendText(`${this.name}的护甲防住了${source.name}的攻势`, 'good');
        }
    }

    goToSite(game: Game, newSite: Site): void {
        game.appendText(`${this.name}来到了${newSite.name}`, 'mutate');
        super.goToSite(game, newSite);
    }

    getWeapon(): Item {
        return new MeleeWeapon({
            id: 'melee',
            name: this.baseWeaponName,
            damage: this.baseDamage,
        });
    }

    isAlive(): boolean {
        return this.health > 0;
    }

    removeSelf(game: Game): boolean {
        if (this.site !== Site.FAKE_SITE) {
            this.site.removeEntity(game, this);
            return true;
        }
        return false;
    }
}

export default LivingEntity;
export type {
    LivingEntityData,
}