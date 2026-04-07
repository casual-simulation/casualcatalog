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
let maxDistance = 30;

if (configBot.tags.mapPortal) {
    speed = 500;
    maxDistance = .01;
}

let dur = distance * speed;

clearAnimations(thisBot);

if (distance > maxDistance) {
    tags[that.dimension + 'X'] = that.position.x;
    tags[that.dimension + 'Y'] = that.position.y;
} else {
    await animateTag(thisBot, {
        fromValue: {
            [that.dimension + 'X']: tags[that.dimension + 'X'] ?? 0,
            [that.dimension + 'Y']: tags[that.dimension + 'Y'] ?? 0,
        },
        toValue: {
            [that.dimension + 'X']: that.position.x,
            [that.dimension + 'Y']: that.position.y,
        },
        duration: dur,
        tagMaskSpace: false
    });
}


