import ChatEvent from "../../data/event/ChatEvent";
import { DisplayText, Option } from "../../interfaces/types";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";

export interface ChatComponentData extends ComponentBaseData {
    talkText?: DisplayText; // 只说一遍的话
    idleText?: DisplayText; // 闲聊天的话语，一般没啥内容
    chat?: ChatEvent; // 一般是长文本，和故事有关
}

export default class ChatComponent extends ComponentBase {

    public static readonly ID = "chat";

    override get id(): string {
        return ChatComponent.ID;
    }

    greetingText: DisplayText;
    idleText: DisplayText;
    chat: ChatEvent | null;

    constructor(data: ChatComponentData) {
        super(data);

        this.greetingText = data.talkText ?? '...';
        this.idleText = data.idleText ?? '...';
        this.chat = data.chat ?? null;
    }

    override getInteractions(): Array<Option> {
        return [
            {
                text: `与 ${this.host.name} 对话`,
                leftText: '👋🏻',
                rightText: this.chat ? '🗨' : '',
                action: () => {
                    if (this.chat) this.game.triggerEvent(this.chat); 
                    else this.talk();
                },
            },
        ];
    }

    private talked: boolean = false;

    private talk() {
        if (!this.talked) {
            this.game.appendText(`${this.host.name} 说:`);
            this.game.appendText(this.greetingText, 'talk');
            this.talked = true;
        } else {
            this.game.appendText(this.idleText);
        }
    }
}