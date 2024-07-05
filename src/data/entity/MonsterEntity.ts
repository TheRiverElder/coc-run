import { LivingEntityData } from "../../buildin/entities/LivingEntity";
import { CombatEntity } from "../../buildin/events/CombatEvent";
import { CombatEvent, Entity, LivingEntity, PlayerEntity, Site } from "../../interfaces/interfaces";
import { chooseOne } from "../../utils/math";

class MonsterEntity extends LivingEntity {


    constructor(data: LivingEntityData) {
        super({
            ...data,
            id: 'monster',
        });
    }

    onDetect(entity: Entity, site: Site) {
        if (entity.id === 'player' || entity instanceof PlayerEntity) {
            this.game.triggerEvent(new CombatEvent({
                game: this.game,
                rivals: [
                    { entity: this, tag: 'monster' },
                    { entity: entity as LivingEntity, tag: 'civilian' },
                ]
            }));
        }
    }

    onCombatTurn(combat: CombatEvent, self: CombatEntity) {
        if (this.health >= this.maxHealth / 4) {
            combat.attack(this, chooseOne(combat.rivals.filter(e => e.tag !== self.tag)).entity);
        } else {
            combat.escape(this);
        }
    }
}

export default MonsterEntity;