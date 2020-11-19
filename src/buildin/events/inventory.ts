import { Game, GameEvent, Option } from "../../interfaces/interfaces";

const eventInventory: GameEvent = {
    id: 'inventory',
    priority: 1,
    uid: 1,

    onStart(game: Game) {
        const p = game.getPlayer();
        game.setOptions([{ text: '返回', tag: [] }]
            .concat(Array.from(p.inventory.values(), i => ({
                text: (p.holdingItem?.uid === i.uid ? '卸下' : '装备') + i.name,
                tag: ['currentState', 'player', 'holdItem',  [p.holdingItem?.uid === i.uid ? i : null]] as any,
            })))
        );
    },

    onRender() {
        return []
    },

    onInput(option: Option, game: Game) {
        if (!option.tag) {
            game.showPortOptions();
        } else if (Array.isArray(option.tag)) {
            const p = game.getPlayer();
            const [c, uid] = option.tag;
            if (c === 'hold') {
                p.holdItem(uid, game);
            } else if (c === 'unhold') {
                p.holdItem(null, game);
            }
        }
        game.endEvent(this);
    },
}

export default eventInventory;
