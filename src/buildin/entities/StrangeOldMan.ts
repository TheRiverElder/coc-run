import { CombatEvent, Game, LivingEntity } from "../../interfaces/interfaces";
import NPCEntity from "./NPCEntity";

class StrangeOldMan extends NPCEntity {
    shadow?: LivingEntity;

    onBeAttack(game: Game) {
        if (!this.shadow || !this.shadow.isAlive()) {
            this.shadow = new NPCEntity({
                name: `${this.name}的影子`,
                health: this.health,
                maxHealth: this.maxHealth,
                dexterity: this.dexterity,
                strength: this.strength,
                baseDamage: this.baseDamage,
                baseWeaponName: this.baseWeaponName,
                talkText: this.talkText,
            });
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