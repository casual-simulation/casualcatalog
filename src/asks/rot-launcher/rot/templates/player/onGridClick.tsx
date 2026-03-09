// if we have their location don't allow manual movement
if(tags.continueLocationPull){
    return;
}

whisper(thisBot, 'moveTo', {
    dimension: that.dimension,
    x: that.position.x,
    y: that.position.y,
});

os.focusOn(that.position, {
    portal: 'map',
    duration: tags.moveTime * 3,
    easing: {
        type: "quadratic",
    mode: "inout"
    }
})