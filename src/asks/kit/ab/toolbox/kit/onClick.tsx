if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

//create arm
// const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
// const inMap = configBot.tags.mapPortal ? true: false;
// const armBot = ab.links.arm_tool.abCreateArm({
//     originBot: thisBot,
//     dimension: dimension,
//     position: {
//         x: tags[dimension + 'X'] + (inMap ? 0.0002 : 2),
//         y: tags[dimension + 'Y']
//     },
// })

// thisBot.onArmPlaced({'dimension': dimension, 'x': tags[dimension + 'X'] + (inMap ? 0.0002 : 2), 'y': tags[dimension + 'Y']})

ab.links.manifestation.equipKit({kit: tags.kitId, kitBot: '🔗' + thisBot.id})