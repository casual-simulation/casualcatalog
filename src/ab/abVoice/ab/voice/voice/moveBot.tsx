
that.bot.tags[that.dimension] = true;

const prevX = that.bot.tags[that.dimension + 'X'] ?? 0;
const prevY = that.bot.tags[that.dimension + 'Y'] ?? 0;

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

clearAnimations(that.bot);
await animateTag(that.bot, {
    fromValue: {
        [that.dimension + 'X']: that.bot.tags[that.dimension + 'X'] ?? 0,
        [that.dimension + 'Y']: that.bot.tags[that.dimension + 'Y'] ?? 0,
    },
    toValue: {
        [that.dimension + 'X']: that.position.x,
        [that.dimension + 'Y']: that.position.y,
    },
    duration: dur,
    tagMaskSpace: 'shared'
});

return;