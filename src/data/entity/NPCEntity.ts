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

    onDetect(entity: Entity, site: Site) {
        if (entity.id === 'player' && !this.takled) {
            this.talk();
        }
    }

    getInteractions(): Array<Option> {
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

    onInteract(option: Option, subopt: Subopt) {
        if (subopt.tag === 'talk') {
            if (this.chat) {
                this.game.triggerEvent(this.chat);
            } else {
                this.talk();
            }
        } else if (subopt.tag === 'attack') {
            this.onBeAttack();
        }
    }

    onBeAttack(): void {
        this.game.triggerEvent(new CombatEvent({
            game: this.game,
            rivals: [
                { entity: this.game.getPlayer(), tag: 'civilian' },
                { entity: this, tag: 'angry_civilian' },
            ]
        }));
    }

    talk() {
        if (!this.takled) {
            this.game.appendText(`${this.name}说:`);
            this.game.appendText(this.talkText, 'talk');
            this.takled = true;
        } else {
            this.game.appendText(this.idleText);
        }
    }

    onCombatTurn(combat: CombatEvent, self: CombatEntity) {
        if (this.health >= this.maxHealth * 0.75) {
            combat.attack(this, chooseOne(combat.rivals.filter(e => e.tag !== self.tag)).entity);
        } else {
            combat.escape(this);
        }
    }
}

export default NPCEntity;
export type {
    NPCEntityData,
}