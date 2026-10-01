if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that`, that, links.abBot);
}

let abBot = links.abBot;

if (!abBot) {
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
    abBot = await thisBot.abManifestBot({dimension: dimension, position: {x: 0, y: 0}});
}

if (that.dimension != tags.dimension) {
    abBot.tags[tags.dimension] = null;
    // links.spriteBot.tags[tags.dimension] = null;

    abBot.tags.dimension = that.dimension;
    // links.spriteBot.tags.dimension = that.dimension;
}

// if (links.navigation) {
//     if (!ab.links.navigation.tags.usingGPS) {
//         links.equipment.onEquipmentBaseDeselected(thisBot);
//     }
// } else {
//     links.equipment.onEquipmentBaseDeselected(thisBot);
// }

abBot.tags[that.dimension] = true;

const prevX = abBot.tags[that.dimension + 'X'] ?? 0;
const prevY = abBot.tags[that.dimension + 'Y'] ?? 0;

const distance = Math.sqrt(Math.pow((that.position.x - prevX), 2) + Math.pow((that.position.y - prevY), 2));
let speed = 0.05;
let maxDistance = 30;

if (configBot.tags.mapPortal) {
    speed = 500;
    maxDistance = .01;
}

let dur = distance * speed;

clearAnimations(abBot);

if (distance > maxDistance) {
    abBot.tags[that.dimension + 'X'] = that.position.x;
    abBot.tags[that.dimension + 'Y'] = that.position.y;

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] quick move`);
    }
} else {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] slow move`);
    }
    await animateTag(abBot, {
        fromValue: {
            [that.dimension + 'X']: abBot.tags[that.dimension + 'X'] ?? 0,
            [that.dimension + 'Y']: abBot.tags[that.dimension + 'Y'] ?? 0,
        },
        toValue: {
            [that.dimension + 'X']: that.position.x,
            [that.dimension + 'Y']: that.position.y,
        },
        duration: dur,
        tagMaskSpace: false
    });
}


