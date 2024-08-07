const translation = {
    "property.money": "硬币",
    "property.health": "体力",
    "property.magic": "魔力",
    "property.strength": "力量",
    "property.dexterity": "敏捷",
    "property.insight": "洞察",

    "story.start": `
        我叫{player_name}，是家里的老四
        （此处省略三千字）
        几天后，有村民目击到了大舅亲手把母亲推了悬崖
        现在有了三份财产等着我继承
        带着复杂的心情，我坐上了回乡的大巴
    `,
    "story.end": `
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
    `,

    "talk.老者.idle": [
        "哟~小妞子",
        "应该是大壮家里的吧",
        "年轻真好",
        "我要是也年轻就好了",
    ],
    "talk.王屠夫.greeting": [
        "这不是{player_name}吗？好久不见了",
    ],
    "talk.廖族长.greeting": `
        你就是廖秋吧@talk@
        我是廖家的族长，接下来就由我带你吧@talk@
        先去你家把东西拿上@talk@
    `,

    text: {
        money: '硬币',
        health: '体力',
        magic: '魔力',
        strength: '力量',
        dexterity: '敏捷',
        insight: '洞察',
    },
    story: {
        start: `
            我叫王二狗，是家里的老四
            （此处省略三千字）
            几天后，有村民目击到了大舅亲手把母亲推了悬崖
            现在有了三份财产等着我继承
            带着复杂的心情，我坐上了回乡的大巴
        `,
        end: `
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
        `,
        old_mans_talk: `
            哟~小伙子
            应该是王大壮家里的吧
            年轻真好
            我要是也年轻就好了
        `,
        wang: `
            这不是廖秋吗？好久不见了
        `,
        elder: {
            welcome: `
                你就是廖秋吧@talk@
                我是廖家的族长，接下来就由我带你吧@talk@
                先去你家把东西拿上@talk@
            `,
            take_things: `
                好久没来了吧@talk@
                你外公的东西都放在他的房间了，自己去拿吧@talk@
                我就不陪你了@talk@
            `,
        },
    },
    idle: {
        old_man: [
            '嗯？有事吗？',
            '今天的太阳真舒服',
            '人都变了啊',
            '世界更好了呢',
            '哎',
        ],
    },
    description: {
        strange_note: `
            上面写着“……”
            但是
        `,
        site: {
            old_house: `
                随让又新增了一些违章建筑，但是总体结构还是没变
                【房屋结构图】
            `,
        },
    },
};

export default translation;