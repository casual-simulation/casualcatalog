const catalogBots = getBots(byTag("studioId", that), byTag("studioCatalog", true));
if (!catalogBots) {
    return;
}

let closest;
let closestDistance;

for (let i = 0; i < catalogBots.length; ++i) {
    const distance = Math.sqrt((catalogBots[i].tags[(tags.dimension ?? 'home') + 'X'] - tags[(tags.dimension ?? 'home') + 'X']) ** 2 + (catalogBots[i].tags[(tags.dimension ?? 'home') + 'Y'] - tags[(tags.dimension ?? 'home') + 'Y']) ** 2);

    if (!closest) {
        closest = catalogBots[i];
        closestDistance = distance;
    } else {
        if (distance < closestDistance) {
            closest = catalogBots[i];
            closestDistance = distance;
        }
    }
}

tags.lineTo = getID(closest);