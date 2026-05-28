if (tags.remoteID != getID(configBot)) {
    return;
}

shout("clearSimPlayerMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

thisBot.moveAvatar({
        dimension: that.dimension ?? "home",
        position: {
            x: that.position.x,
            y: that.position.y
        }
    })