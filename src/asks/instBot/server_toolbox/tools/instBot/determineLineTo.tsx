if (!tags.studioId) {
    tags.lineTo = null;
    return;
}

const catalogBots = [];

getBots(b => {
    if (b.tags.abArtifactName === 'studioCatalog' && b.tags.studioId === tags.studioId) {
        catalogBots.push(b);
    }
});

if (catalogBots.length === 0) {
    return;
}

let closest;
let closestDistance;

for (let i = 0; i < catalogBots.length; ++i) {
    const dim = tags.dimension ?? 'home';
    const distance = Math.sqrt((catalogBots[i].tags[dim + 'X'] - tags[dim + 'X']) ** 2 + (catalogBots[i].tags[dim + 'Y'] - tags[dim + 'Y']) ** 2);

    if (!closest || distance < closestDistance) {
        closest = catalogBots[i];
        closestDistance = distance;
    }
}

tags.lineTo = getID(closest);