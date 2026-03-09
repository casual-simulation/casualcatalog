// Trash Can
create({
    space: 'tempLocal', 
    [configBot.tags.leftWristPortalName]: true,
    [configBot.tags.leftWristPortalName + 'X']: 0,
    [configBot.tags.leftWristPortalName + 'Y']: 4,
    scaleX: 2,
    scaleY: 2,
    scaleZ: 0.1,
    draggable: false,
    label: 'Trash Can',
    labelFontSize: 1.5,
    color: '#B3B3B3',
    onDrop: `@
        const droppedOnMe = that.to.bot && that.to.bot.id === thisBot.id;

        if (droppedOnMe) {
            let dragBot = that.bot ?? that.dragBot;
            destroy(dragBot)
        }
    `
});

// New Bot
let newBotShared = getBot('newBotShared', true);
if (!newBotShared) {
    newBotShared = create({
        space: 'shared',
        label: 'Drag for New Bot',
        labelFontSize: 0.75,
        newBotShared: true,
        ab1Ignore: true,
        onColorPick: `@
            masks.color = that.color;
        `,
        onDrag: `@
            const clone = create(thisBot);
            clone.tags.color = tags.color;
            clone.tags.onDrag = null;
            clone.tags.label = null;
            clone.tags.labelFontSize = null;
            clone.tags.onColorPick = null;
            clone.tags.newBotShared = null;

            os.replaceDragBot(clone);
        `,
    })
}

os.sleep(100).then(() => {
    // Add shared New Bot to our wrist.
    newBotShared.masks[configBot.tags.leftWristPortalName] = true;
    newBotShared.masks[configBot.tags.leftWristPortalName + 'X'] = 3;
    newBotShared.masks[configBot.tags.leftWristPortalName + 'Y'] = 4;
})

// Create color pallete
const SIZE = 0.35;
const PADDING = 0.1;
const COLUMNS = 12;
const START_POS_X = 0;
const START_POS_Y = 2.5;

let curCol = 1;
let curRow = 1;

function addColorBot({ color }) {
    create({
        space: 'tempLocal',
        [configBot.tags.leftWristPortalName]: true,
        [configBot.tags.leftWristPortalName + 'X']: START_POS_X + (curCol * (SIZE + PADDING)),
        [configBot.tags.leftWristPortalName + 'Y']: START_POS_Y + (-curRow * (SIZE + PADDING)),
        color,
        draggable: false,
        scaleX: SIZE,
        scaleY: SIZE,
        scaleZ: 0.1,
        onClick: `@
            shout('onColorPick', { color: tags.color });
        `
    })

    curCol++;
    if (curCol > COLUMNS) {
        curCol = 1;
        curRow++;
    }
}

addColorBot({ color: '#4D4D4D' });
addColorBot({ color: '#999999' });
addColorBot({ color: '#FFFFFF' });
addColorBot({ color: '#F44E3B' });
addColorBot({ color: '#FE9200' });
addColorBot({ color: '#FCDC00' });
addColorBot({ color: '#DBDF00' });
addColorBot({ color: '#A4DD00' });
addColorBot({ color: '#68CCCA' });
addColorBot({ color: '#73D8FF' });
addColorBot({ color: '#AEA1FF' });
addColorBot({ color: '#FDA1FF' });


addColorBot({ color: '#333333' });
addColorBot({ color: '#808080' });
addColorBot({ color: '#CCCCCC' });
addColorBot({ color: '#D33115' });
addColorBot({ color: '#E27300' });
addColorBot({ color: '#FCC400' });
addColorBot({ color: '#B0BC00' });
addColorBot({ color: '#68BC00' });
addColorBot({ color: '#16A5A5' });
addColorBot({ color: '#009CE0' });
addColorBot({ color: '#7B64FF' });
addColorBot({ color: '#FA28FF' });

addColorBot({ color: '#000000' });
addColorBot({ color: '#666666' });
addColorBot({ color: '#B3B3B3' });
addColorBot({ color: '#9F0500' });
addColorBot({ color: '#C45100' });
addColorBot({ color: '#FB9E00' });
addColorBot({ color: '#808900' });
addColorBot({ color: '#194D33' });
addColorBot({ color: '#0C797D' });
addColorBot({ color: '#0062B1' });
addColorBot({ color: '#653294' });
addColorBot({ color: '#AB149E' });