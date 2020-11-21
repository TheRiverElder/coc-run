import { Game, GameEvent, Option } from "../../interfaces/interfaces";

class InventoryEvent extends GameEvent {

    constructor() {
        super({
            id: 'inventory',
            priority: 10
        });
    }

    onStart(game: Game) {
        const p = game.getPlayer();
        game.setOptions([{ text: '返回', tag: [] }]
            .concat(Array.from(p.inventory.values(), i => ({
                text: (p.holdingItem?.uid === i.uid ? '卸下' : '装备') + i.name,
                tag: ['currentState', 'player', 'holdItem',  [p.holdingItem?.uid === i.uid ? i : null]] as any,
            })))
        );
    }

    onRender(game: Game) {
        const p = game.getPlayer();
        const options = [
            { text: '返回' },
            ...p.inventory.values().map(i => ({ 
                text: '拿上' + i.name,
                leftText: '🤜',
                rightText: i.previewDamage(game),
                tag: i.uid,
            })),
        ];
        if (p.holdingItem) {
            options.splice(1, 0, { 
                text: '收起'+ p.holdingItem.name,
                leftText: '🤚',
                rightText: p.holdingItem.previewDamage(game),
                tag: p.holdingItem.uid,
            });
        }
        return options;
    }

    onInput(game: Game, option: Option) {
        if (typeof option.tag === 'number') {
            const p = game.getPlayer();
            const item = p.inventory.get(option.tag);
            if (item) {
                p.holdItem(game, (item.uid === p.holdingItem?.uid) ? null : item);
            }
        }
        game.endEvent(this);
    }
}

export default InventoryEvent;
