import { LivingEntityData } from "../../buildin/entities/LivingEntity";
import { CombatEntity } from "../../buildin/events/CombatEvent";
import { CombatEvent, Entity, LivingEntity, PlayerEntity, Site } from "../../interfaces/interfaces";
import { chooseOne } from "../../utils/math";

export interface MonsterEntityData extends LivingEntityData {
    escapeValve?: number; // 血量低于多少的时候逃跑
}

export default class MonsterEntity extends LivingEntity {

    escapeValve: number;


    constructor(data: MonsterEntityData) {
        super({
            ...data,
            id: 'monster',
        });

        this.escapeValve = data.escapeValve ?? data.maxHealth * 0.25;
    }

    onDetect(entity: Entity, site: Site) {
        if (entity instanceof PlayerEntity) {
            this.game.triggerEvent(new CombatEvent({
                game: this.game,
                rivals: [
                    { entity: this, tag: 'monster' },
                    { entity, tag: 'civilian' },
                ],
            }));
        }
    }

    onCombatTurn(combat: CombatEvent, self: CombatEntity) {
        if (this.health >= this.escapeValve) {
            combat.attack(this, chooseOne(combat.rivals.filter(e => e.tag !== self.tag)).entity);
        } else {
            combat.escape(this);
        }
    }
}