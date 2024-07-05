import { LivingEntityData } from "../../buildin/entities/LivingEntity";
import { CombatEntity } from "../../buildin/events/CombatEvent";
import { CombatEvent, Game, LivingEntity, Site } from "../../interfaces/interfaces";
import { chooseOne } from "../../utils/math";
import MonsterEntity from "./MonsterEntity";

interface ShadowData {
    game: Game;
    id?: string;
    uid?: number;
    name?: string;
    site?: Site;
    owner: LivingEntity;
}

class Shadow extends MonsterEntity {
    owner: LivingEntity;

    constructor(data: ShadowData) {
        const owner = data.owner;
        const d: LivingEntityData = {
            ...data,
            id: 'shadow',
            name: `${owner.name}的影子`,
            health: owner.health,
            maxHealth: owner.maxHealth,
            strength: owner.strength,
            dexterity: owner.dexterity,
            baseDamage: owner.baseDamage,
            baseWeaponName: owner.baseWeaponName,
        };
        super(d);
        this.owner = owner;
    }

    onCombatStart(combat: CombatEvent, self: CombatEntity) {

    }

    onCombatTurn(combat: CombatEvent, self: CombatEntity) {
        combat.attack(this, chooseOne(combat.rivals.filter(e => e.tag !== self.tag)).entity);
    }

    onCombatEnd(combat: CombatEvent, self: CombatEntity) {
        this.removeSelf();
    }
}

export default Shadow;
export type {
    ShadowData,
}