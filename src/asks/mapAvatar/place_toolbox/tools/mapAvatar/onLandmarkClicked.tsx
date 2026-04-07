if (tags.remoteID != getID(configBot) || tags.usingGPS) {
    return;
}

const landmark = getBot("landmarkID", that);

let xPos;
let yPos;

if (tags[landmark.tags.dimension + 'X'] > landmark.tags[landmark.tags.dimension + 'X']) {
    xPos = landmark.tags[landmark.tags.dimension + 'X'] + .0002;
} else {
    xPos = landmark.tags[landmark.tags.dimension + 'X'] - .0002;
}

if (tags[landmark.tags.dimension + 'Y'] > landmark.tags[landmark.tags.dimension + 'Y']) {
    yPos = landmark.tags[landmark.tags.dimension + 'Y'] + .0002;
} else {
    yPos = landmark.tags[landmark.tags.dimension + 'Y'] - .0002;
}

thisBot.moveAvatar({
        dimension: landmark.tags.dimension ?? "home",
        position: {
            x: xPos,
            y: yPos
        }
    })