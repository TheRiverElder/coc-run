import { Dice, Game, Item, MeleeWeapon, Site } from "../../interfaces/interfaces";
import Entity, { EntityData } from "./Entity";

interface LivingEntityData extends EntityData {
    health: number;
    maxHealth: number;
    strength: number;
    dexterity: number;
    baseDamage: Dice | number;
    baseWeaponName: string;
}

class LivingEntity extends Entity {
    
    health: number;
    maxHealth: number;
    strength: number;
    dexterity: number;
    baseDamage: Dice | number;
    baseWeaponName: string;

    constructor(data: LivingEntityData) {
        super(data);
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.baseDamage = data.baseDamage;
        this.baseWeaponName = data.baseWeaponName;
    }

    mutateValue(key: string, delta: number, game: Game, reason?: string): void {
        switch(key) {
            case 'health': this.health += delta; break;
            case 'strength': this.strength += delta; break;
            case 'dexterity': this.dexterity += delta; break;
        }
        game.appendText((reason || '') + key + ' ' + (delta >= 0 ? '+' + delta : String(delta)));
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