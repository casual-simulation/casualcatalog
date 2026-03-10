os.playSound(soundBot.tags.btnDown)

await animateTag(thisBot, "scaleZ", {
    fromValue: tags.hoverHeight,
    toValue: tags.pressHeight,
    duration: tags.pressSpeed,
})