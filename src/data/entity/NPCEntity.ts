import { Entity, Game, LivingEntity, Site, Option, CombatEvent } from "../../interfaces/interfaces";
import { chooseOne } from "../../utils/math";
import { CombatEntity } from "../../buildin/events/CombatEvent";
import { LivingEntityData } from "../../buildin/entities/LivingEntity";
import { DisplayText, Subopt } from "../../interfaces/types";
import ChatEvent from "../event/ChatEvent";

interface NPCEntityData extends LivingEntityData {
    talkText: DisplayText;
    chat?: ChatEvent;
    idleText?: DisplayText;
    autoChat?: boolean;
    allowAttack?: boolean;
}

class NPCEntity extends LivingEntity {
    talkText: DisplayText;
    idleText: DisplayText;
    chat?: ChatEvent;
    autoChat: boolean;
    takled: boolean;

    constructor(data: NPCEntityData) {
        super({
            ...data,
            id: 'npc',
        });
        this.talkText = data.talkText;
        this.chat = data.chat;
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
                text: this.name,
                leftText: '👨‍🦲',
                subopts: [
                    { text: '对话', tag: 'talk' },
                    { text: '攻击', tag: 'attack' },
                ]
            },
        ];
    }

    onInteract(game: Game, option: Option, subopt: Subopt) {
        if (subopt.tag === 'talk') {
            if (this.chat) {
                game.triggerEvent(this.chat);
            } else {
                this.talk(game);
            }
        } else if (subopt.tag === 'attack') {
            this.onBeAttack(game);
        }
    }

    onBeAttack(game: Game): void {
        game.triggerEvent(new CombatEvent({ rivals: [
            { entity: game.getPlayer(), tag: 'civilian'},
            { entity: this, tag: 'angry_civilian' },
        ]}));
    }

    talk(game: Game) {
        if (!this.takled) {
            game.appendText(`${this.name}说:`);
            game.appendText(this.talkText, 'talk');
            this.takled = true;
        } else {
            game.appendText(this.idleText);
        }
    }

    onCombatTurn(game: Game, combat: CombatEvent, self: CombatEntity) {
        if (this.health >= this.maxHealth * 0.75) {
            combat.attack(game, this, chooseOne(combat.rivals.filter(e => e.tag !== self.tag)).entity);
        } else {
            combat.escape(game, this);
        }
    }
}

export default NPCEntity;
export type {
    NPCEntityData,
}