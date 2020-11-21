import MonsterEntity from "./buildin/entities/MonsterEntity";
import { Game, GameData, ItemEntity, MeleeWeapon, PlayerEntity, PortEntity, Site } from "./interfaces/interfaces";
import { randInt } from "./utils/math";
import InvestigationEntity from "./buildin/entities/InvestigationEntity";
import EventTriggerEntity from "./buildin/entities/EventTriggerEntity";
import TextDisplayEvent from "./buildin/events/TextDisplayEvent";
import SequenceEvent from "./buildin/events/SequenceEvent";
import GameOverEvent from "./buildin/events/GameOverEvent";

function randValue(): number {
    return 5 * randInt(7, 1, 3);
}

const data = {
    initialize() {
        const sites = [
            new Site({
                id: 'bus_stop',
                name: '巴士车站',
                entities: [new PortEntity({ target: 'ng_bridge' })],
                onEnter: (game: Game) => game.setOptions([
                    { text: '到村子里去', tag: ['player', 'goToSite', ['hs_village']] },
                    { text: '回城里', tag: ['gameOver', ['小江坐上了离开的巴士。']] },
                ]),
            }),
            new Site({
                id: 'ng_bridge',
                name: '鼐沟桥',
                entities: [new PortEntity({ target: 'hs_village' })],
            }),
            new Site({
                id: 'hs_village',
                name: '灴山村',
                entities: [
                    new PortEntity({ target: 'main_streat'  }),
                    new PortEntity({ target: 'ng_bridge' }),
                ],
            }),
            new Site({
                id: 'main_streat',
                name: '大路',
                entities: [
                    new PortEntity({ target: 'temple' }),
                    new PortEntity({ target: 'wang_house' }),
                    new PortEntity({ target: 'ng_bridge' }),
                    new ItemEntity({ item: new MeleeWeapon({
                        id: 'bone',
                        name: '猪骨',
                        damage: 3,
                    }), autoEquip: true }),
                ],
            }),
            new Site({
                id: 'wang_house',
                name: '王屠户家',
                entities: [
                    new PortEntity({ target: 'main_streat' }),
                    new InvestigationEntity({
                        results: [new ItemEntity({item: new MeleeWeapon({
                            name: '杀猪刀',
                            damage: { faces: 3, times: 2, fix: -1 },
                        }), autoEquip: true })]
                    }),
                ],
            }),
            new Site({
                id: 'temple',
                name: '祠堂',
                entities: [
                    new PortEntity({ target: 'temple_basement' }),
                    new PortEntity({ target: 'main_streat' }),
                ],
            }),
            new Site({
                id: 'temple_basement',
                name: '祠堂地下室',
                entities: [
                    new PortEntity({ target: 'temple' }),
                    new MonsterEntity({
                        name: '触手怪',
                        baseDamage: { faces: 2, fix: 1 },
                        baseWeaponName: '爪子',
                        health: 10,
                        maxHealth: 10,
                        strength: 30,
                        dexterity: 40,
                        loots: [new PortEntity({
                            target: 'dark_river'
                        })]
                    }),
                ],
            }),
            new Site({
                id: 'dark_river',
                name: '漆黑之河',
                entities: [
                    new PortEntity({ target: 'temple_basement' }),
                    new EventTriggerEntity({
                        option: { text: '跳入其中', leftText: '🏊‍' },
                        event: new SequenceEvent({
                            events: [
                                new TextDisplayEvent({ texts: [{ text: 'end_text', translated: true }] }),
                                new GameOverEvent({ reason: '完美通关' })
                            ],
                            joints: [{ text: '结束了' }]
                        })
                    }),
                ],
            }),
            new Site({
                id: 'hospital',
                name: '医院',
            }),
        ];
        const map = new Map<string, Site>();
        sites.map(s => map.set(s.id, s));
        const playerMaxHealth = randInt(10) + 5;
        return {
            events: [],
            map,
            options: [],
            time: 0,
            player: new PlayerEntity({
                id: 'player',
                name: '王二狗',
                site: map.get('bus_stop') as Site,
                money: randValue(),
                health: playerMaxHealth,
                maxHealth: playerMaxHealth,
                magic: randValue(),
                strength: randValue(),
                dexterity: randValue(),
                insight: randValue(),
                holdingItem: null,
                inventory: [],
                baseDamage: 1,
                baseWeaponName: '拳头',
            }),
        };
    },
    start: (game: Game) => {
        game.appendText("你是小江，少小离村去了城里，不常回来，最近家里说有事情找你，立刻回去，于是你收拾好了行装。");
    },
    translate(key: string) {
        return (this.translation as any)[key] || key;
    },
    translation: {
        money: '金钱',
        health: '体力',
        magic: '魔力',
        strength: '力量',
        dexterity: '敏捷',
        insight: '洞察',
        end_text:  `
            你发现了地下有一条暗黑的河流，甚至手电筒的关联都不能照亮它一毫
            仿佛有一种声音在召唤你，让你向它靠近
            正在思考眼前的一切时，你已经来到了暗河边
            
            你跳入了这条河流
            没有一丝丝冰凉或溺水的痛苦，也没有任何其它感觉
            你能感受到河水带着你飘向了无尽的黑暗深渊
            可是你却丝毫不想反抗

            不知道过了多久后，你醒了

            在清晨的阳光中，病床上的你睁开双眼
            询问护士的结果是，有人在海边发现了你，神志不清
        `
    },
};

const d: GameData = data;

export default d;