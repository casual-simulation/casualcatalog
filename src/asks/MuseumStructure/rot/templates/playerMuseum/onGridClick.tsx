if (that.dimension=="home"){
let pointBots=getBots(byTag("name","Floor"))
setTag(pointBots, "pointable",false)
//if we have their location don't allow manual movement
whisper(thisBot, 'moveTo', {
    dimension: that.dimension,
    x: that.position.x,
    y: that.position.y,
});

os.focusOn(that.position, {
    portal: 'home',
    duration: tags.moveTime * 3,
    easing: {
        type: "quadratic",
    mode: "inout"
    }
})}