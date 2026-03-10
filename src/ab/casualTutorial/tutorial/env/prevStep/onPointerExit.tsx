masks.color = '#ffffff'

await animateTag(thisBot, "scaleZ", {
    fromValue: tags.hoverHeight,
    toValue: 0.5,
    duration: tags.pressSpeed,
})