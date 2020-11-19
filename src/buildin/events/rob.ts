import { Game, GameEvent, Option } from "../../interfaces/interfaces";
import { randInt, test } from "../../utils/math";

const eventRob: GameEvent = {
    id: 'rob',
    priority: 1,
    uid: 3,

    onStart(game: Game) {
        game.appendText('你遭遇了抢劫！', 'bad');
        game.setOptions([
            { text: '反击', tag: 'fight' },
            { text: '交钱', tag: 'hand_over' },
        ]);
    },

    onRender() {
        return []
    },

    onInput(option: Option, game: Game) {
        const p = game.getPlayer();
        if (option.tag === 'fight') {
            if (test(0.2)) { 
                game.appendText('你赢了', 'good'); 
            } else { 
                p.mutateValue('money', -randInt(30, 15), game, '丢了脸, 还丢了钱');
            }
        } else if (option.tag === 'hand_over') {
            p.mutateValue('money', -randInt(20, 10), game, '破财消灾');
        }
        game.endEvent(this);
    },
}

export default eventRob;
