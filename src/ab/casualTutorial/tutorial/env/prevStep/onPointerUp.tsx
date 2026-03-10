os.playSound(soundBot.tags.btnUp)

await animateTag(thisBot, "scaleZ", {
    fromValue: tags.pressHeight,
    toValue: 0.5,
    duration: tags.pressSpeed,
})