import { Game, GameData, Item, ItemEntity, MeleeWeapon, PlayerEntity, PortEntity, Site } from "../interfaces/interfaces";
import { chooseOne, randInt } from "../utils/math";
import InvestigationEntity from "../buildin/entities/InvestigationEntity";
import EventTriggerEntity from "../buildin/entities/EventTriggerEntity";
import TextDisplayEvent from "../buildin/events/TextDisplayEvent";
import SequenceEvent from "../buildin/events/SequenceEvent";
import GameOverEvent from "../buildin/events/GameOverEvent";
import translation from "./translation";
import { findByPathStr } from "../utils/strings";
import StrangeOldMan from "./entity/StrangeOldMan";
import MonsterEntity from "./entity/MonsterEntity";
import ChatEvent from "./event/ChatEvent";
import NPCEntity from "./entity/NPCEntity";

function randValue(): number {
    return 5 * randInt(7, 1, 3);
}

const data = {
    initialize(game: Game) {
        const villageWang = new NPCEntity({
            game,
            name: '王屠夫',
            health: 7,
            maxHealth: 7,
            strength: 30,
            dexterity: 30,
            baseDamage: 1,
            baseWeaponName: '拳头',
            talkText: { text: 'story.wang', translated: true },
        });
        const villageLiheng = new StrangeOldMan({
            game,
            name: '老者',
            health: 7,
            maxHealth: 7,
            strength: 30,
            dexterity: 30,
            baseDamage: 1,
            baseWeaponName: '拳头',
            loots: [
                new ItemEntity({ item: new Item({ game, name: '扭曲的木拐杖' }) }),
                new ItemEntity({ item: new Item({ game, name: '磨损的铜钱' }) }),
            ],
            talkText: { text: 'story.old_mans_talk', translated: true },
            idleText: { text: 'idle.old_man', translated: true },
        });
        const elder = new NPCEntity({
            game,
            name: '廖族长',
            health: 7,
            maxHealth: 7,
            strength: 30,
            dexterity: 30,
            baseDamage: 1,
            baseWeaponName: '拳头',
            talkText: '#story.elder.welcome',
        });


        const sites = [
            new Site({
                game,
                id: 'apartment',
                name: '公寓',
                entities: [new EventTriggerEntity({
                    event: new ChatEvent({
                        game,
                        blocks: [
                            { id: 'start', text: ['#story.start'] },
                        ],
                    })
                })],
            }),
            new Site({
                game,
                id: 'bus_stop',
                name: '巴士车站',
                entities: [
                    new PortEntity({ game, target: 'ng_bridge' }),
                    new EventTriggerEntity({
                        option: { text: '还是回城里吧', leftText: '🏙' },
                        event: new GameOverEvent({ game, reason: '因为你是头号玩家' }),
                        once: true,
                    }),
                ],
            }),
            new Site({
                game,
                id: 'ng_bridge',
                name: '鼐沟桥',
                entities: [
                    new PortEntity({ game, target: 'hs_village' }),
                    new PortEntity({ game, target: 'bus_stop' }),
                    villageLiheng,
                ],
            }),
            new Site({
                game,
                id: 'hs_village',
                name: '灴山村',
                entities: [
                    new PortEntity({ game, target: 'main_streat' }),
                    new PortEntity({ game, target: 'ng_bridge' }),
                ],
            }),
            new Site({
                game,
                id: 'main_streat',
                name: '大路',
                entities: [
                    new PortEntity({ game, target: 'temple' }),
                    new PortEntity({ game, target: 'wang_house' }),
                    new PortEntity({ game, target: 'ng_bridge' }),
                    new ItemEntity({
                        item: new MeleeWeapon({
                            game,
                            id: 'bone',
                            name: '猪骨',
                            damage: 3,
                        }), autoEquip: true
                    }),
                ],
            }),
            new Site({
                game,
                id: 'wang_house',
                name: '王屠户家',
                entities: [
                    new PortEntity({ game, target: 'main_streat' }),
                    villageWang,
                    new InvestigationEntity({
                        game,
                        results: [new ItemEntity({
                            item: new MeleeWeapon({
                                game,
                                name: '杀猪刀',
                                damage: { faces: 3, times: 2, fix: -1 },
                            }), autoEquip: true
                        })]
                    }),
                ],
            }),
            new Site({
                game,
                id: 'temple',
                name: '祠堂',
                entities: [
                    new PortEntity({ game, target: 'temple_basement' }),
                    new PortEntity({ game, target: 'main_streat' }),
                    elder,
                ],
            }),
            new Site({
                game,
                id: 'temple_basement',
                name: '祠堂地下室',
                entities: [
                    new PortEntity({ game, target: 'temple' }),
                    new MonsterEntity({
                        game,
                        name: '触手怪',
                        baseDamage: { faces: 2, fix: 1 },
                        baseWeaponName: '爪子',
                        health: 10,
                        maxHealth: 10,
                        strength: 30,
                        dexterity: 40,
                        loots: [new PortEntity({
                            game,
                            target: 'dark_river'
                        })]
                    }),
                ],
            }),
            new Site({
                game,
                id: 'dark_river',
                name: '漆黑之河',
                entities: [
                    new PortEntity({ game, target: 'temple_basement' }),
                    new EventTriggerEntity({
                        option: { text: '跳入其中', leftText: '🏊‍' },
                        event: new SequenceEvent({
                            game,
                            events: [
                                new TextDisplayEvent({ game, texts: [{ text: 'story.end', translated: true }] }),
                                new GameOverEvent({ game, reason: '完美通关' })
                            ],
                            joints: [{ text: '结束了' }]
                        })
                    }),
                ],
            }),
            new Site({
                game,
                id: 'old_house',
                name: 'laofangzi',
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
                game,
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
                inventory: [
                    new Item({
                        game,
                        name: '奇怪的簪子'
                    }),
                ],
                baseDamage: 1,
                baseWeaponName: '拳头',
            }),
        };
    },
    
    start: (game: Game) => {
        game.appendText({ text: 'story.start', translated: true });
        game.getPlayer().goToSite(game.getMap().get('bus_stop') as Site);
    },

    translate(key: string): string {
        const result = findByPathStr(translation, key, key.indexOf('.') >= 0 ? '' : 'text') || key;
        if (Array.isArray(result)) {
            return chooseOne(result);
        }
        return typeof result === 'string' ? result : String(result);
    },
};

const d: GameData = data;

export default d;