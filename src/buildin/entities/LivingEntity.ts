import { Dice, Game, Item, ItemEntity, MeleeWeapon, Site } from "../../interfaces/interfaces";
import { num2strWithSign } from "../../utils/strings";
import Entity, { EntityData } from "./Entity";

interface LivingEntityData extends EntityData {
    health: number;
    maxHealth: number;
    strength: number;
    dexterity: number;
    baseDamage: Dice | number;
    baseWeaponName: string;
    loots?: Array<Entity | Item>;
}

class LivingEntity extends Entity {
    
    health: number;
    maxHealth: number;
    strength: number;
    dexterity: number;
    baseDamage: Dice | number;
    baseWeaponName: string;
    loots: Array<Entity>;

    constructor(data: LivingEntityData) {
        super(data);
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.baseDamage = data.baseDamage;
        this.baseWeaponName = data.baseWeaponName;
        this.loots = data.loots?.map(e => e instanceof Item ? new ItemEntity({ item: e }) : e) || [];
    }

    mutateValue(key: string, delta: number, game: Game, reason?: string): void {
        switch(key) {
            case 'health': this.health += delta; break;
            case 'strength': this.strength += delta; break;
            case 'dexterity': this.dexterity += delta; break;
        }
        game.appendText(`${this.name} ${reason || ''} ${game.translate(key)} ${num2strWithSign(delta)}`);
        if (!this.isAlive()) {
            game.appendText(`${this.name}死亡`);
            this.site.removeEntity(this, game);
        }
    }

    goToSite(newSite: Site, game: Game): void {
        game.appendText(`${this.name}来到了${newSite.name}`, 'mutate');
        super.goToSite(newSite, game);
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
}

export default LivingEntity;
export type {
    LivingEntityData,
}