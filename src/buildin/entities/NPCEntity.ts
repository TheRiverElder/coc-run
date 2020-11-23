import { Entity, Game, LivingEntity, Site, Text, Option, CombatEvent } from "../../interfaces/interfaces";
import { LivingEntityData } from "./LivingEntity";

interface NPCEntityData extends LivingEntityData {
    text: Text;
    idleText?: Text;
    autoChat?: boolean;
    allowAttack?: boolean;
}

class NPCEntity extends LivingEntity {
    text: Text;
    idleText: Text;
    autoChat: boolean;
    takled: boolean;

    constructor(data: NPCEntityData) {
        super({
            ...data,
            id: 'npc',
        });
        this.text = data.text;
        this.idleText = data.idleText || { text: '...' };
        this.autoChat = data.autoChat || false;
        this.takled = false;
    }

    onDetect(game: Game, entity: Entity, site: Site) {
        if (entity.id === 'player' && !this.takled) {
            this.talk(game);
        }
    }

    getInteractions(game: Game): Array<Option> {
        return [
            {
                text: `对话${this.name}`,
                leftText: '💬',
                tag: 'talk',
            },
            {
                text: `攻击${this.name}`,
                leftText: '🗡',
                tag: 'attack',
            },
        ];
    }

    onInteract(game: Game, option: Option) {
        if (option.tag === 'talk') {
            this.talk(game);
        } else if (option.tag === 'attack') {
            game.triggerEvent(new CombatEvent({ enemy: this, playerFirst: true }));
        }
    }

    talk(game: Game) {
        if (!this.takled) {
            game.appendText(`${this.name}说:`);
            game.appendText(this.text, 'talk');
            this.takled = true;
        } else {
            game.appendText(this.idleText);
        }
    }
}

export default NPCEntity;
export type {
    NPCEntityData,
}