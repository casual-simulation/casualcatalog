if (tags.ownerID !=  authBot?.id || links.homeworld?.tags.usingGPS) {
    return;
}

const landmark = getBot("landmarkID", that);

if (!landmark) {
    return;
}

clearAnimations(thisBot);

let xPos;
let yPos;

const dimension = landmark.tags.dimension ?? "home";

if (tags[dimension + 'X'] > landmark.tags[dimension + 'X']) {
    xPos = landmark.tags[dimension + 'X'] + .0002;
} else {
    xPos = landmark.tags[dimension + 'X'] - .0002;
}

if (tags[dimension + 'Y'] > landmark.tags[dimension + 'Y']) {
    yPos = landmark.tags[dimension + 'Y'] + .0002;
} else {
    yPos = landmark.tags[dimension + 'Y'] - .0002;
}

thisBot.moveAvatar({
        dimension: dimension,
        position: {
            x: xPos,
            y: yPos
        }
    })