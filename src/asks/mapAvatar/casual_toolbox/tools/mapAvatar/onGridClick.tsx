if (tags.ownerID !=  authBot?.id || tags.usingGPS) {
    return;
}

if (links.homeworld && links.homeworld.tags.introPlayed) {
    shout("clearMapAvatarMenu");
}

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

changeState(thisBot, false, "selected");

if (!configBot.tags.mapPortal) {
    thisBot.moveAvatar({
        dimension: configBot.tags.gridPortal ?? "home",
        position: {
            x: that.position.x,
            y: that.position.y
        }
    })
}

