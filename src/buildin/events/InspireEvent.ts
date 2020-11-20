import { Game, GameEvent, Item, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";

interface InspireEventData {
    item: Item;
}

class InspireEvent extends GameEvent {
    item: Item;

    constructor(data: InspireEventData) {
        super({
            id: 'inspire',
            priority: 10,
        });
        this.item = data.item;
    }

    onStart(game: Game) {
        game.appendText('你感受到了附近有什么值得注意的东西');
        game.setOptions([
            { text: '探索周围', tag: 'investigate' },
            { text: '无视', tag: 'ignore' },
        ]);
    }

    onRender() {
        return []
    }

    onInput(opt: Option, game: Game) {
        const p = game.getPlayer();
        if (opt.tag === 'investigate') {
            if (test(p.insight)) {
                game.appendText('你发现了一个看起来有意思的东西');
                p.holdItem(this.item, game);
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
