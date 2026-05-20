const egg = getBot(byTag("eggConfigurator", true), byTag("studioId", tags.studioId), byTag("chosenEggName", that.ab));
if (egg) {
    egg.updateEggData();
    return;
}

if (!masks.selected) {
    masks.selected = true;
}

await os.sleep(0);

const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
const isMap = configBot.tags.mapPortal ? true : false;
const inRad = isMap ? .0001 : 3;
const rad = isMap ? .0005 : 5;
const space = isMap ? .0005 : 1;

const pos = ab.links.utils.findOpenPositionAround({center: new Vector2(tags[dimension + 'X'], tags[dimension + 'Y']), dimension: dimension, innerRadius: inRad, radius: rad, spacing: space})

//createEgg
const abArtifactShard = {
    data: {
        eggName: that.ab,
        eggStudio: tags.studioId,
        eggConfigConfirmed: true,
        studioId: tags.studioId,
        eggParameters: {
            toolboxBot: getLink(thisBot),
            gridInformation: {
                dimension: dimension,
                position: {
                    x: pos.x,
                    y: pos.y
                }
            }
        }
    },
    dependencies: [
        {
            askID: 'eggConfigurator'
        }
    ]
};

links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'eggConfigurator',
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});