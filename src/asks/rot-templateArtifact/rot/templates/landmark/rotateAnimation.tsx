// if the player isn't near then hide the label
thisBot.toggleLabel(tags["playerNear" + configBot.id])
// if we are already rotating do nothing
if (tags["rotating" + configBot.id] || !tags["playerNear" + configBot.id]) { return; }


tags.mapZ = 0
tags["rotating" + configBot.id] = true;

//console.log("rotating")
while (tags["playerNear" + configBot.id] && !tags.discoveredArtifact) {
    let duration = 3.5
    animateTag(thisBot, "mapZ", {
        duration: duration,
        fromValue: 0,
        toValue: 3,
        tagMaskSpace: "tempLocal"
    })
    await animateTag(thisBot, "mapRotationZ", {
        duration: duration,
        fromValue: 0,
        toValue: Math.PI / 2,
        tagMaskSpace: "tempLocal"
    })
    animateTag(thisBot, "mapZ", {
        duration: duration,
        fromValue: 3,
        toValue: 0,
        tagMaskSpace: "tempLocal"
    })
    await animateTag(thisBot, "mapRotationZ", {
        duration: duration,
        fromValue: Math.PI / 2,
        toValue: Math.PI,
        tagMaskSpace: "tempLocal"
    })
}
tags["rotating" + configBot.id] = false;
