if (ab.links.navigation?.tags.usingGPS) {
    return;
}

// const place = getBot("system", that);

if (!that) {
    return;
}

clearAnimations(links.abBot);

let xPos;
let yPos;
const dimension = that.dimension ?? "home";

if (links.abBot.tags[dimension + 'X'] > that.x) {
    xPos = that.x + .0005;
} else {
    xPos = that.x - .0005;
}

if (links.abBot.tags[dimension + 'Y'] > that.y) {
    yPos = that.y + .0005;
} else {
    yPos = that.y - .0005;
}

thisBot.moveAvatar({
        dimension: dimension,
        position: {
            x: xPos,
            y: yPos
        }
    })