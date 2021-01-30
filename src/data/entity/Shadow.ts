import { CombatEntity } from "../../buildin/events/CombatEvent";
import { CombatEvent, Game, LivingEntity, Site } from "../../interfaces/interfaces";
import { chooseOne } from "../../utils/math";
import MonsterEntity from "./MonsterEntity";

interface ShadowData {
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
        const d = {
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

    onCombatStart(game: Game, combat: CombatEvent, self: CombatEntity) {
        
    }

    onCombatTurn(game: Game, combat: CombatEvent, self: CombatEntity) {
        combat.attack(game, this, chooseOne(combat.rivals.filter(e => e.tag !== self.tag)).entity);
    }

    onCombatEnd(game: Game, combat: CombatEvent, self: CombatEntity) {
        this.removeSelf(game);
    }
}

export default Shadow;
export type {
    ShadowData,
}