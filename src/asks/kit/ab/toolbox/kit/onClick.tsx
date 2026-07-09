if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

// shout('abMenuRefresh');
// shout("clearKitMenu");

// configBot.tags.menuPortal = 'kit_menu';

// const menuOptions = {
//     kit_menu: true,
//     clearKitMenu: `@destroy(thisBot);`,
//     abMenuRefresh: "@destroy(thisBot);",
//     kit: getLink(thisBot)
// }

//create arm
const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const inMap = configBot.tags.mapPortal ? true: false;
const armBot = ab.links.arm_tool.abCreateArm({
    originBot: thisBot,
    dimension: dimension,
    position: {
        x: tags[dimension + 'X'] + (inMap ? 0.0002 : 2),
        y: tags[dimension + 'Y']
    },
})

thisBot.onArmPlaced({'dimension': dimension, 'x': tags[dimension + 'X'] + (inMap ? 0.0002 : 2), 'y': tags[dimension + 'Y']})