if (!tags.studioId) {
    tags.lineTo = null;
    return;
}

const catalogBots = [];
const sameKitBots = [];

getBots(b => {
    if (b.tags.abArtifactName === 'studioCatalog' && b.tags.studioId === tags.studioId) {
        catalogBots.push(b);
    } else if (b !== thisBot && b.tags.abArtifactName === 'kit' && b.tags.label === tags.label && b.tags.studioId === tags.studioId) {
        sameKitBots.push(b);
    }
});

if (catalogBots.length === 0) {
    return;
}

const takenCatalogIds = new Set(sameKitBots.map(b => b.tags.lineTo).filter(Boolean));

const candidates = catalogBots.filter(c => !takenCatalogIds.has(getID(c)));
const pool = candidates.length > 0 ? candidates : catalogBots;

let closest;
let closestDistance;

for (let i = 0; i < pool.length; ++i) {
    const dim = tags.dimension ?? 'home';
    const distance = Math.sqrt((pool[i].tags[dim + 'X'] - tags[dim + 'X']) ** 2 + (pool[i].tags[dim + 'Y'] - tags[dim + 'Y']) ** 2);

    if (!closest || distance < closestDistance) {
        closest = pool[i];
        closestDistance = distance;
    }
}

tags.lineTo = getID(closest);