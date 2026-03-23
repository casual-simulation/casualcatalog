if (tags.remoteID != getID(configBot) || tags.usingGPS) {
    return;
}

shout("clearSimPlayerMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

if (that.dimension != tags.dimension) {
    tags[tags.dimension] = null;
    links.spriteBot.tags[tags.dimension] = null;

    tags.dimension = that.dimension;
    links.spriteBot.tags.dimension = that.dimension;
}

tags[that.dimension] = true;
links.spriteBot.tags[that.dimension] = true;
links.spriteBot.tags[that.dimension + 'Z'] = -0.5;

const prevX = tags[that.dimension + 'X'] ?? 0;
const prevY = tags[that.dimension + 'Y'] ?? 0;

const distance = Math.sqrt(Math.pow((that.position.x - prevX), 2) + Math.pow((that.position.y - prevY), 2));
let speed = 0.05;

if (configBot.tags.mapPortal) {
    speed = 500;
}

let dur = distance * speed;

if (distance > 30) {
    dur = 2;
}

if (configBot.tags.mapPortal) {
    if (distance > .1) {
        dur = 2;
    }
}

clearAnimations(thisBot);
await animateTag(bot, {
    fromValue: {
        [that.dimension + 'X']: tags[that.dimension + 'X'] ?? 0,
        [that.dimension + 'Y']: tags[that.dimension + 'Y'] ?? 0,
    },
    toValue: {
        [that.dimension + 'X']: that.position.x,
        [that.dimension + 'Y']: that.position.y,
    },
    duration: dur,
    tagMaskSpace: 'shared'
});