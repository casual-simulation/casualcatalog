tags[that.dimension] = true;

const prevX = tags[that.dimension + 'X'] ?? 0;
const prevY = tags[that.dimension + 'Y'] ?? 0;

const dx = that.position.x - prevX;
const dy = that.position.y - prevY;

const distance = Math.sqrt(Math.pow((dx), 2) + Math.pow((dy), 2));

let uX = dx / distance;
let uY = dy / distance;

clearAnimations(that.bot);
await animateTag(that.bot, {
    fromValue: {
        [that.dimension + 'X']: tags[that.dimension + 'X'] ?? 0,
        [that.dimension + 'Y']: tags[that.dimension + 'Y'] ?? 0,
    },
    toValue: {
        [that.dimension + 'X']: (tags[that.dimension + 'X'] ?? 0) + uX,
        [that.dimension + 'Y']: (tags[that.dimension + 'Y'] ?? 0) + uY,
    },
    duration: 1,
    tagMaskSpace: 'shared'
});

return;