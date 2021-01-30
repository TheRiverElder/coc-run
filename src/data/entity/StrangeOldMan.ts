import { CombatEvent, Game, LivingEntity } from "../../interfaces/interfaces";
import NPCEntity, { NPCEntityData } from "./NPCEntity";
import Shadow from "./Shadow";

interface StrangeOldManData extends NPCEntityData {
    shadow?: LivingEntity;
}

class StrangeOldMan extends NPCEntity {
    shadow?: LivingEntity;

    constructor(data: StrangeOldManData) {
        super(data);
        this.shadow = data.shadow;
    }

    onBeAttack(game: Game) {
        if (!this.shadow || !this.shadow.isAlive()) {
            this.shadow = new Shadow({ owner: this });
            this.site.addEntity(game, this.shadow);
        }
        game.triggerEvent(new CombatEvent({ rivals: [
            { entity: game.getPlayer(), tag: 'civilian'},
            { entity: this, tag: 'angry_civilian' },
            { entity: this.shadow, tag: 'angry_civilian' },
        ]}));
    }
}

export default StrangeOldMan;
export type {
    StrangeOldManData,
}