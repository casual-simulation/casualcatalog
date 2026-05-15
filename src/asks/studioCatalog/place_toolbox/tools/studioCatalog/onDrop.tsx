const connectedBots = getBots("lineTo", getID(thisBot));
for (let i = 0; i < connectedBots.length; ++i) {
    const dimension = that.to.dimension;
    const prevX = connectedBots[i].tags[dimension + 'X'];
    const prevY = connectedBots[i].tags[dimension + 'Y'];

    const offsetX = that.to.x - that.from.x;
    const offsetY = that.to.y - that.from.y;

    connectedBots[i].tags[dimension + 'X'] = prevX + offsetX;
    connectedBots[i].tags[dimension + 'Y'] = prevY + offsetY;
}