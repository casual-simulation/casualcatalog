if (tags.remoteID != getID(configBot) || tags.usingGPS) {
    return;
}

const landmark = getBot("landmarkID", that);

let xPos;
let yPos;

if (tags[landmark.tags.dimension + 'X'] > landmark.tags[landmark.tags.dimension + 'X']) {
    xPos = landmark.tags[landmark.tags.dimension + 'X'] + 2;
} else {
    xPos = landmark.tags[landmark.tags.dimension + 'X'] - 2;
}

if (tags[landmark.tags.dimension + 'Y'] > landmark.tags[landmark.tags.dimension + 'Y']) {
    xPos = landmark.tags[landmark.tags.dimension + 'Y'] + 2;
} else {
    xPos = landmark.tags[landmark.tags.dimension + 'Y'] - 2;
}

thisBot.moveAvatar({
        dimension: landmark.tags.dimension ?? "home",
        position: {
            x: xPos,
            y: yPos
        }
    })