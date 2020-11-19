import { Game, GameEvent, Option } from "../../interfaces/interfaces";

const eventEnd: GameEvent = {
    id: 'end',
    uid: 0,
    priority: 0,

    onStart(game: Game) {
        game.appendText('你发现了地下有一条暗黑的河流，甚至手电筒的关联都不能照亮它一毫');
        game.appendText('仿佛有一种声音在召唤你，让你向它靠近');
        game.appendText('正在思考眼前的一切时，你已经来到了暗河边');
        game.setOptions([
            { text: '跳入', tag: 'jump' },
            { text: '还是算了', tag: 'forget_it' },
        ]);
    },

    onRender() {
        return []
    },

    onInput(option: Option, game: Game) {
        if (option.tag === 'jump') {
            game.appendText(`
                你跳入了这条河流
                没有一丝丝冰凉或溺水的痛苦，也没有任何其它感觉
                你能感受到河水带着你飘向了无尽的黑暗深渊
                可是你却丝毫不想反抗
            `);
            // game.getPlayer().goToSite('hospital');
            game.appendText('不知道过了多久后，你醒了', 'mutate');
            game.timePass(6, true);
            game.appendText('在清晨的阳光中，病床上的你睁开双眼');
            game.appendText('询问护士的结果是，有人在海边发现了你，神志不清');
            game.gameOver('完美通关');
        } else if (option.tag === 'forget_it') {
            game.appendText('什么都没发生');
        }
        game.endEvent(this);
    },
}

export default eventEnd;
