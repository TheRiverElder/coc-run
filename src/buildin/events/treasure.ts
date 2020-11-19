import { Game, GameEvent, MeleeWeapon, Option } from "../../interfaces/interfaces";
import { test } from "../../utils/math";

const eventTreasure: GameEvent = {
    id: 'treasure',
    priority: 1,
    uid: 4,

    onStart(game: Game) {
        game.appendText('你感受到了附近有什么值得注意的东西');
        game.setOptions([
            { text: '探索周围', tag: 'investigate' },
            { text: '无视', tag: 'ignore' },
        ]);
    },

    onRender() {
        return []
    },

    onInput(opt: Option, game: Game) {
        const p = game.getPlayer();
        if (opt.tag === 'investigate') {
            if (test(p.insight)) {
                game.appendText('泥发现了一个看起来有意思的东西');
                const weapon = new MeleeWeapon({
                    id: 'melee',
                    name: '带血屠刀',
                    damage: { faces: 3, times: 2, fix: 1 },
                });
                p.holdItem(weapon, game);
            } else {
                game.appendText('可惜啥都没发现');
            }
        } else if (opt.tag === 'ignore') {
            game.appendText('于是继续向前走去');
        }
        game.endEvent(this);
    },
}

export default eventTreasure;
