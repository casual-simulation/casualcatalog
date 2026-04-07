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
    duration: 0,
    tagMaskSpace: 'shared'
});