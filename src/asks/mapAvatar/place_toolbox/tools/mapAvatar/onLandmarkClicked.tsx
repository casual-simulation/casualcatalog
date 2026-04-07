if (tags.remoteID != getID(configBot) || tags.usingGPS) {
    return;
}

const landmark = getBot("landmarkID", that);

thisBot.moveAvatar({
        dimension: landmark.tags.dimension ?? "home",
        position: {
            x: landmark.tags[landmark.tags.dimension + 'X'],
            y: landmark.tags[landmark.tags.dimension + 'Y']
        }
    })