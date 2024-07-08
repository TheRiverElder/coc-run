import { Game, GameEvent, Item, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";
import { GameEventData } from "../GameEvent";

interface InspireEventData extends GameEventData {
    item: Item;
}

class InspireEvent extends GameEvent {
    item: Item;

    constructor(data: InspireEventData) {
        super({
            ...data,
            id: 'inspire',
            priority: 10,
        });
        this.item = data.item;
    }

    override onStart() {
        this.game.appendText('你感受到了附近有什么值得注意的东西');
        this.game.setOptions([
            { text: '探索周围', tag: 'investigate' },
            { text: '无视', tag: 'ignore' },
        ]);
    }

    onRender() {
        return []
    }

    onInput(game: Game, opt: Option) {
        const p = game.getPlayer();
        if (opt.tag === 'investigate') {
            if (test(p.insight)) {
                game.appendText('你发现了一个看起来有意思的东西');
                p.holdItem(this.item);
            } else {
                game.appendText('可惜啥都没发现');
            }
        } else if (opt.tag === 'ignore') {
            game.appendText('于是继续向前走去');
        }
        game.endEvent(this);
    }
}

export default InspireEvent;
export type {
    InspireEventData,
}
