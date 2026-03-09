await animateTag(thisBot, "scale", {
    fromValue: 1,
    toValue: 1.025,
    duration: 0.5
})

await animateTag(thisBot, "scale", {
    fromValue: 1.025,
    toValue: 1,
    duration: 0.5
})

await animateTag(thisBot, "scale", {
    fromValue: 1,
    toValue: 1.025,
    duration: 0.5
})

await animateTag(thisBot, "scale", {
    fromValue: 1.025,
    toValue: 1,
    duration: 0.5
})

await os.sleep(500)

if (!tags.firstClick) {
    thisBot.animatePulse()
}