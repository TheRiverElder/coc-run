import { Game, GameEvent, Text } from "../../interfaces/interfaces";
import { GameEventData } from "../GameEvent";

interface TextDisplayEventData extends GameEventData {
    texts: Array<Text>;
}

class TextDisplayEvent extends GameEvent {
    texts: Array<Text>;

    constructor(data: TextDisplayEventData) {
        super({
            ...data,
            priority: 10,
        });
        this.texts = data.texts;
    }

    override onStart() {
        this.texts.forEach(t => this.game.appendText(t));
        this.game.endEvent(this);
    }
}

export default TextDisplayEvent;
export type {
    TextDisplayEventData,
}