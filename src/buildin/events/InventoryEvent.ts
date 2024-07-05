import { Game, GameEvent, Option } from "../../interfaces/interfaces";
import { Subopt } from "../../interfaces/types";

class InventoryEvent extends GameEvent {

    constructor(game: Game) {
        super({
            game,
            id: 'inventory',
            priority: 99
        });
    }

    override onStart() {
        const p = this.game.getPlayer();
        this.game.setOptions([{ text: '返回', tag: [] }]
            .concat(Array.from(p.inventory.values(), i => ({
                text: (p.holdingItem?.uid === i.uid ? '卸下' : '装备') + i.name,
                tag: ['currentState', 'player', 'holdItem',  [p.holdingItem?.uid === i.uid ? i : null]] as any,
            })))
        );
    }

    override onRender(): Array<Option> {
        const p = this.game.getPlayer();
        const options: Array<Option> = [
            { text: '返回' },
            ...p.inventory.values().map(i => ({ 
                text: i.name,
                leftText: '🤜',
                rightText: i.previewDamage(),
                subopts: [
                    { text: '装备', tag: 'hold' },
                    { text: '丢弃', tag: 'drop' },
                ],
                tag: i.uid,
            })),
        ];
        if (p.holdingItem) {
            options.splice(1, 0, { 
                text: '收起'+ p.holdingItem.name,
                leftText: '🤚',
                rightText: p.holdingItem.previewDamage(),
                tag: p.holdingItem.uid,
            });
        }
        return options;
    }

    override onInput(option: Option, subopt: Subopt) {
        if (typeof option.tag === 'number') {
            const uid: number = option.tag;
            const p = this.game.getPlayer();

            if (uid === p.holdingItem?.uid) {
                p.unholdItem();
            } else {
                const item = p.inventory.get(option.tag);
                if (item) {
                    if (subopt.tag === 'hold') {
                        p.holdItem(item);
                    } else if (subopt.tag === 'drop') {
                        p.removeItemFromInventory(item, 'drop');
                    }
                }
            }
        } else {
            this.game.endEvent(this);
        }
    }
}

export default InventoryEvent;
