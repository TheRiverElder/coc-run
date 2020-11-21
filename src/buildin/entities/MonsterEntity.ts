import { CombatEvent, Entity, Game, LivingEntity, PlayerEntity, Site } from "../../interfaces/interfaces";
import { LivingEntityData } from "./LivingEntity";

class MonsterEntity extends LivingEntity {

    constructor(data: LivingEntityData) {
        super({
            ...data,
            id: 'monster',
        });
    }

    onDetect(game: Game, entity: Entity, site: Site) {
        if (entity.id === 'player' || entity instanceof PlayerEntity) {
            game.triggerEvent(new CombatEvent({
                id: 'combat',
                enemy: this,
            }));
        }
    }
}

export default MonsterEntity;