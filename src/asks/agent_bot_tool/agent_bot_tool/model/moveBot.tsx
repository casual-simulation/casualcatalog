tags[that.dimension] = true;

const prevX = tags[that.dimension + 'X'] ?? 0;
const prevY = tags[that.dimension + 'Y'] ?? 0;

const dx = that.position.x - prevX;
const dy = that.position.y - prevY;

const distance = Math.sqrt(dx * dx + dy * dy);

if (distance === 0) return;

// Step at most 1 tile per call; don't overshoot if target is closer than 1 tile.
const step = Math.min(1, distance);
const uX = (dx / distance) * step;
const uY = (dy / distance) * step;

clearAnimations(thisBot);
await animateTag(thisBot, {
    fromValue: {
        [that.dimension + 'X']: prevX,
        [that.dimension + 'Y']: prevY,
    },
    toValue: {
        [that.dimension + 'X']: prevX + uX,
        [that.dimension + 'Y']: prevY + uY,
    },
    duration: 1,
    tagMaskSpace: 'shared'
});

return;