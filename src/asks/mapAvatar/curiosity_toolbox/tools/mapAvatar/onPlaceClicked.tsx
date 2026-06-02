if (tags.remoteID != getID(configBot) || tags.continueLocationPull) {
    return;
}

const place = getBot("system", that);

if (!place) {
    return;
}

clearAnimations(thisBot);

let xPos;
let yPos;
const dimension = place.tags.dimension ?? "home";

if (tags[dimension + 'X'] > place.tags[dimension + 'X']) {
    xPos = place.tags[dimension + 'X'] + .0005;
} else {
    xPos = place.tags[dimension + 'X'] - .0005;
}

if (tags[dimension + 'Y'] > place.tags[dimension + 'Y']) {
    yPos = place.tags[dimension + 'Y'] + .0005;
} else {
    yPos = place.tags[dimension + 'Y'] - .0005;
}

thisBot.moveAvatar({
        dimension: dimension,
        position: {
            x: xPos,
            y: yPos
        }
    })