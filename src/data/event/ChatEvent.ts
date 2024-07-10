import GameEvent, { GameEventData } from "../../buildin/GameEvent";
import IdMap from "../../buildin/IdMap";
import { Option, Text } from "../../interfaces/types";

export interface ChatOption {
    text: string;
    target: string | null;
}

export interface ChatBlock {
    id: string;
    text: Array<Text | string>;
    options?: Array<ChatOption>;
}

export interface ChatEventData extends GameEventData {
    blocks: Array<ChatBlock>;
    entry?: string;
}

export default class ChatEvent extends GameEvent {
    private blocks: IdMap<ChatBlock>;
    private currentBlockId: string;

    constructor(data: ChatEventData) {
        super({
            ...data,
            id: 'chat',
            priority: 10,
        });
        this.blocks = new IdMap(data.blocks);
        this.currentBlockId = data.entry || data.blocks[0].id;
    }

    override onStart(): void {
        this.displayTextAndCheckEnd();
    }

    override onRender(): Array<Option> {
        const block = this.blocks.get(this.currentBlockId);
        return block?.options?.map(option => ({ 
            text: option.text, 
            tag: option.target,
            action: () => {
                if (option.target) {
                    this.currentBlockId = option.target;
                    this.displayTextAndCheckEnd();
                } else {
                    this.endSelf();
                }
            },
        })) ?? [];
    }

    private displayTextAndCheckEnd() {
        const block = this.blocks.get(this.currentBlockId);
        if (block) {
            block.text.forEach(line => this.game.appendText(line));
            if (!block.options || !block.options.length) {
                this.endSelf();
            }
        }
    }
}