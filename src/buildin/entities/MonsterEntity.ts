import { CombatEvent, Entity, Game, LivingEntity, PlayerEntity, Site } from "../../interfaces/interfaces";
import { chooseOne } from "../../utils/math";
import { CombatEntity } from "../events/CombatEvent";
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
            game.triggerEvent(new CombatEvent({ rivals: [
                { entity: this, tag: 'monster' },
                { entity: entity as LivingEntity, tag: 'civilian' },
            ]}));
        }
    }

    onCombatTurn(game: Game, combat: CombatEvent, self: CombatEntity) {
        if (this.health >= this.maxHealth / 4) {
            combat.attack(game, this, chooseOne(combat.rivals.filter(e => e.tag !== self.tag)).entity);
        } else {
            combat.escape(game, this);
        }
    }
}

export default MonsterEntity;