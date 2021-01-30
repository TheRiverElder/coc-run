import GameEvent from "../../buildin/GameEvent";
import IdMap from "../../buildin/IdMap";
import { Game } from "../../interfaces/interfaces";
import { Identical, Option, Subopt, Text } from "../../interfaces/types";

interface ChatOption {
    text: string;
    target: string | null;
}

interface ChatBlock extends Identical {
    text: Array<Text | string>;
    options?: Array<ChatOption>;
}

interface ChatEventData {
    blocks: Array<ChatBlock>;
    entry?: string;
}

class ChatEvent extends GameEvent {
    blocks: IdMap<ChatBlock>;
    currentBlockId: string;

    constructor(data: ChatEventData) {
        super({
            id: 'chat',
            priority: 10,
        });
        this.blocks = new IdMap(data.blocks);
        this.currentBlockId = data.entry || data.blocks[0].id;
    }

    onStart(game: Game): void {
        this.displayTextAndCheckEnd(game);
    }

    onRender(game: Game): Array<Option> {
        const block = this.blocks.get(this.currentBlockId);
        return block?.options?.map(e => ({ text: e.text, tag: e.target })) || [];
    }

    onInput(game: Game, option: Option, subopt: Subopt | null): void {
        if (typeof option.tag === 'string') {
            this.currentBlockId = option.tag;
            this.displayTextAndCheckEnd(game);
        } else {
            game.endEvent(this);
        }
    }

    displayTextAndCheckEnd(game: Game) {
        const block = this.blocks.get(this.currentBlockId);
        if (block) {
            block.text.forEach(line => game.appendText(line));
            if (!block.options || !block.options.length) {
                game.endEvent(this);
            }
        }
    }
}

export default ChatEvent;
export type {
    ChatEventData,
    ChatBlock,
    ChatOption,
}