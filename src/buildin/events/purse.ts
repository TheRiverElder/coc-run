import { Game, GameEvent, Option } from "../../interfaces/interfaces";
import { randInt, test } from "../../utils/math";

const eventPurse: GameEvent = {
    id: 'purse',
    priority: 1,
    uid: 2,

    onStart(game: Game) {
        game.appendText('你看到地上有个钱包');
        game.setOptions([
            { text: '捡起来', tag: 'pick_up' },
            { text: '无视', tag: 'ignore' },
        ]);
    },

    onRender() {
        return []
    },

    onInput(option: Option, game: Game) {
        if (option.tag === 'pick_up') {
            const p = game.getPlayer();
            if (test(0.2)) {
                p.mutateValue('health', -randInt(20, 10), game, '被失主发现，反被打了一顿');
            } else {
                p.mutateValue('money', randInt(100) + 1, game, '你捡到钱了');
            }
        } else if (option.tag === 'ignore') {
            game.appendText('于是继续向前走去');
        }
        game.endEvent(this);
    },
}

export default eventPurse;
