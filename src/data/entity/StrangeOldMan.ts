import { CombatEvent, LivingEntity } from "../../interfaces/interfaces";
import NPCEntity, { NPCEntityData } from "./NPCEntity";
import Shadow from "./Shadow";

export interface StrangeOldManData extends NPCEntityData {
    shadow?: LivingEntity;
}

export default class StrangeOldMan extends NPCEntity {
    shadow?: LivingEntity;

    constructor(data: StrangeOldManData) {
        super(data);
        this.shadow = data.shadow;
    }

    onBeAttack() {
        if (!this.shadow || !this.shadow.isAlive()) {
            this.shadow = new Shadow({ game: this.game, owner: this });
            this.site.addEntity(this.shadow);
        }
        if (this.shadow) {
            this.game.triggerEvent(new CombatEvent({
                game: this.game, 
                rivals: [
                    { entity: this.game.getPlayer(), tag: 'civilian' },
                    { entity: this, tag: 'angry_civilian' },
                    { entity: this.shadow, tag: 'angry_civilian' },
                ],
            }));
        }
    }
}