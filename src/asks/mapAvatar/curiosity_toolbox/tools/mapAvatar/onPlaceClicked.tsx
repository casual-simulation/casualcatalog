if (tags.remoteID != getID(configBot) || tags.usingGPS) {
    return;
}

const place = getBot("system", that);

if (!place) {
    return;
}

let xPos;
let yPos;

if (tags[place.tags.dimension + 'X'] > place.tags[place.tags.dimension + 'X']) {
    xPos = place.tags[place.tags.dimension + 'X'] + .0002;
} else {
    xPos = place.tags[place.tags.dimension + 'X'] - .0002;
}

if (tags[place.tags.dimension + 'Y'] > place.tags[place.tags.dimension + 'Y']) {
    yPos = place.tags[place.tags.dimension + 'Y'] + .0002;
} else {
    yPos = place.tags[place.tags.dimension + 'Y'] - .0002;
}

thisBot.moveAvatar({
        dimension: place.tags.dimension ?? "home",
        position: {
            x: xPos,
            y: yPos
        }
    })