import { Game, GameEvent, Option, Text } from "../../interfaces/interfaces";

interface TextDisplayEventData {
    texts: Array<Text>;
}

class TextDisplayEvent extends GameEvent {
    texts: Array<Text>;

    constructor(data: TextDisplayEventData) {
        super({
            id: 'text',
            priority: 10,
        });
        this.texts = data.texts;
    }

    onStart(game: Game) {
        this.texts.forEach(t => game.appendText(t));
        game.endEvent(this);
    }
}

export default TextDisplayEvent;
export type {
    TextDisplayEventData,
}