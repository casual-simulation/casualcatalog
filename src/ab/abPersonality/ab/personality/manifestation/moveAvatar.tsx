if (that.dimension != tags.dimension) {
    links.abBot.tags[tags.dimension] = null;
    // links.spriteBot.tags[tags.dimension] = null;

    links.abBot.tags.dimension = that.dimension;
    // links.spriteBot.tags.dimension = that.dimension;
}

// if (links.navigation) {
//     if (!ab.links.navigation.tags.usingGPS) {
//         links.equipment.onEquipmentBaseDeselected(thisBot);
//     }
// } else {
//     links.equipment.onEquipmentBaseDeselected(thisBot);
// }

links.abBot.tags[that.dimension] = true;

const prevX = links.abBot.tags[that.dimension + 'X'] ?? 0;
const prevY = links.abBot.tags[that.dimension + 'Y'] ?? 0;

const distance = Math.sqrt(Math.pow((that.position.x - prevX), 2) + Math.pow((that.position.y - prevY), 2));
let speed = 0.05;
let maxDistance = 30;

if (configBot.tags.mapPortal) {
    speed = 500;
    maxDistance = .01;
}

let dur = distance * speed;

clearAnimations(links.abBot);

if (distance > maxDistance) {
    links.abBot.tags[that.dimension + 'X'] = that.position.x;
    links.abBot.tags[that.dimension + 'Y'] = that.position.y;
} else {
    await animateTag(links.abBot, {
        fromValue: {
            [that.dimension + 'X']: links.abBot.tags[that.dimension + 'X'] ?? 0,
            [that.dimension + 'Y']: links.abBot.tags[that.dimension + 'Y'] ?? 0,
        },
        toValue: {
            [that.dimension + 'X']: that.position.x,
            [that.dimension + 'Y']: that.position.y,
        },
        duration: dur,
        tagMaskSpace: false
    });
}


