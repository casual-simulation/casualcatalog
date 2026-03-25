if (tags.remoteID != getID(configBot) || tags.usingGPS) {
    return;
}

shout("clearSimPlayerMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

thisBot.moveAvatar({
        dimension: configBot.tags.mapPortal ?? "home",
        position: {
            x: that.position.x,
            y: that.position.y
        }
    })