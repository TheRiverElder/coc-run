import { Entity, Game, GameData, Item, ItemEntity, PlayerEntity, Site } from "../interfaces/interfaces";
import { chooseOne, randInt } from "../utils/math";
import EventTriggerEntity from "../buildin/entities/EventTriggerEntity";
import TextDisplayEvent from "../buildin/events/TextDisplayEvent";
import SequenceEvent from "../buildin/events/SequenceEvent";
import GameOverEvent from "../buildin/events/GameOverEvent";
import translation from "./translation";
import { findByPathStr } from "../utils/strings";
import ChatEvent from "./event/ChatEvent";
import PortComponent from "../buildin/components/PortComponent";
import HumanEntity from "../buildin/entities/HumanEntity";
import { createSimpleWeaponItem } from "../buildin/items/Item";
import HealthComponent from "../buildin/components/HealthComponent";
import CombatableComponent from "../buildin/components/CombatableComponent";
import MonsterCombatAI from "../buildin/CombatAI/MonsterCombatAI";
import ClueComponent, { createEntityClue, createItemClue, createItemClueAutoPick } from "../buildin/components/ClueComponent";
import { createEntityWithComponents } from "../buildin/entities/Entity";
import ChatComponent from "../buildin/components/ChatComponent";
import CustomComponent from "../buildin/components/CustomComponent";

function randValue(): number {
    return 5 * randInt(7, 1, 3);
}

const data = {
    initialize(game: Game) {

        function createPort(targetSiteId: string): Entity {
            return new Entity({ game, components: [new PortComponent({ target: targetSiteId })] });
        }

        function createPorts(...targetSiteIdList: Array<string>): Array<Entity> {
            return targetSiteIdList.map(target => new Entity({
                game, components: [
                    new PortComponent({ target }),
                ]
            }));
        }

        function createFist() {
            return createSimpleWeaponItem(game, '拳头', 1);
        }

        const villager_王屠夫 = new HumanEntity({
            game,
            name: '王屠夫',
            health: 7,
            maxHealth: 7,
            dexterity: 30,
            defaultWeapon: createFist(),
            components: [
                new ChatComponent({
                    talkText: { text: 'story.wang', translated: true },
                }),
            ],
        });
        const villager_老者 = new HumanEntity({
            game,
            name: '老者',
            health: 7,
            maxHealth: 7,
            dexterity: 30,
            defaultWeapon: createFist(),
            inventory: [
                new Item({ game, name: '扭曲的木拐杖' }),
                new Item({ game, name: '磨损的铜钱' }),
            ],
            components: [
                new ChatComponent({
                    talkText: { text: 'story.old_mans_talk', translated: true },
                    idleText: { text: 'idle.old_man', translated: true },
                }),
            ],
        });
        const villager_廖族长 = new HumanEntity({
            game,
            name: '廖族长',
            health: 7,
            maxHealth: 7,
            dexterity: 30,
            defaultWeapon: createFist(),
            components: [
                new ChatComponent({
                    talkText: '#story.elder.welcome',
                }),
            ],
        });

        const monster_触手怪 = new Entity({
            game,
            name: '触手怪',
            components: [
                new HealthComponent({
                    maxHealth: 10,
                    onDie: (host) => {
                        if (host instanceof Entity) host.site.addEntity(createPort('dark_river'));
                    },
                    doRemoveEntityOnDie: true,
                }),
                new CombatableComponent({
                    dexterity: 40,
                    defaultWeapon: createSimpleWeaponItem(game, '爪子', { faces: 2, fix: 1 }),
                    combatAI: new MonsterCombatAI(),
                }),
            ],
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
                    ...createPorts('ng_bridge'),
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
                    ...createPorts('hs_village', 'bus_stop'),
                    villager_老者,
                ],
            }),
            new Site({
                game,
                id: 'hs_village',
                name: '灴山村',
                entities: [
                    ...createPorts('main_streat', 'ng_bridge'),
                ],
            }),
            new Site({
                game,
                id: 'main_streat',
                name: '大路',
                entities: [
                    ...createPorts('clan_hall', 'wang_house', 'home_house', 'hs_village'),
                    new ItemEntity({
                        item: createSimpleWeaponItem(game, '猪骨', 3),
                        autoEquip: true,
                    }),
                ],
            }),
            new Site({
                game,
                id: 'wang_house',
                name: '王屠户家',
                entities: [
                    ...createPorts('main_streat'),
                    villager_王屠夫,
                    createEntityWithComponents(
                        game,
                        new ClueComponent({
                            discoverer: createEntityClue(new ItemEntity({
                                item: createSimpleWeaponItem(game, '杀猪刀', { faces: 3, times: 2, fix: -1 }),
                                autoEquip: true,
                            })),
                        }),
                    ),
                ],
            }),
            new Site({
                game,
                id: 'home_house',
                name: '自己的老房子',
                entities: [
                    ...createPorts('main_streat', 'mom_room', 'nanny_room'),
                ],
            }),
            new Site({
                game,
                id: 'mom_room',
                name: '妈妈的房间',
                entities: [
                    ...createPorts('home_house'),
                ],
            }),
            new Site({
                game,
                id: 'nanny_room',
                name: '奶奶的房间',
                entities: [
                    ...createPorts('home_house'),
                    new Entity({
                        game,
                        components: [
                            new ClueComponent({ discoverer: createEntityClue(createPort('nanny_secret_room')) }),
                        ],
                    }),
                ],
            }),
            new Site({
                game,
                id: 'nanny_secret_room',
                name: '奶奶的密室',
                entities: [
                    ...createPorts('nanny_room'),
                    createEntityWithComponents(game, new ClueComponent({
                        discoverer: createItemClue(new Item({
                            game,
                            name: '黑木盒',
                        })),
                    })),
                ],
            }),
            new Site({
                game,
                id: 'clan_hall',
                name: '祠堂',
                entities: [
                    ...createPorts('clan_hall_basement', 'main_streat'),
                    villager_廖族长,
                ],
            }),
            new Site({
                game,
                id: 'clan_hall_basement',
                name: '祠堂地下室',
                entities: [
                    ...createPorts('clan_hall'),
                    createEntityWithComponents(game,
                        new ClueComponent({
                            discoverer: createEntityClue(monster_触手怪),
                        }),
                    ),
                ],
            }),
            new Site({
                game,
                id: 'dark_river',
                name: '漆黑之河',
                entities: [
                    ...createPorts('clan_hall_basement'),
                    createEntityWithComponents(game, new CustomComponent({
                        id: 'dark_river',
                        getInteractions: () => [{
                            text: '跳入其中',
                            leftText: '🏊‍',
                            action: () => game.triggerEvent(new SequenceEvent({
                                game,
                                events: [
                                    new TextDisplayEvent({ game, texts: [{ text: 'story.end', translated: true }] }),
                                    new GameOverEvent({ game, reason: '完美通关' }),
                                ],
                                joints: [{ text: '结束了', action: () => game.gameOver('结束了') }],
                            })),
                        }],
                    }))
                ],
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
                name: '王二狗',
                site: map.get('bus_stop') as Site,
                money: 233,
                health: playerMaxHealth,
                maxHealth: playerMaxHealth,
                magic: randValue(),
                dexterity: randValue(),
                insight: randValue(),
                defaultWeapon: createFist(),
                inventory: [
                    new Item({ game, name: '奇怪的簪子' }),
                ],
            }),
        };
    },

    start: (game: Game) => {
        game.appendText({ text: 'story.start', translated: true });
        game.getPlayer().site = (game.getMap().get('bus_stop') as Site);
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