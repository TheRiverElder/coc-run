import ChatEvent from "../../data/event/ChatEvent";
import { DisplayText, Option } from "../../interfaces/types";
import ComponentBase, { ComponentBaseData } from "./CompoenentBase";

export interface ChatComponentData extends ComponentBaseData {
    greetingText?: DisplayText; // 只说一遍的话
    idleText?: DisplayText; // 闲聊天的话语，一般没啥内容
    chat?: ChatEvent; // 一般是长文本，和故事有关
}

export default class ChatComponent extends ComponentBase {

    public static readonly ID = "chat";

    override get id(): string {
        return ChatComponent.ID;
    }

    greetingText: DisplayText | null;
    idleText: DisplayText | null;
    chat: ChatEvent | null;

    constructor(data: ChatComponentData) {
        super(data);

        this.greetingText = data.greetingText ?? null;
        this.idleText = data.idleText ?? null;
        this.chat = data.chat ?? null;
    }

    override getInteractions(): Array<Option> {
        if (!(this.greetingText ?? this.idleText ?? this.chat)) return [];

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
            const displayText = this.greetingText ?? this.idleText;
            if (displayText) {
                this.game.appendText(`${this.host.name} 说:`);
                this.game.appendText(displayText, 'talk');
            }
            this.talked = true;
        } else {
            if (this.idleText) {
                this.game.appendText(this.idleText, 'talk');
            }
        }
    }
}