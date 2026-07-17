const formAdd = ab?.abBuildCasualCatalogURL("/asks/place-assets/grid_textureMesh_01.glb");

const grid = create({
    color: 'white',
    formAddress: formAdd,
    formOpacity: 0.1,
    formSubtype: 'gltf',
    form: 'mesh',
    home: true,
    homeX: 0.52,
    homeY: -0.57,
    homeZ: -0.01,
    pointable: false,
    scaleX: 32,
    scaleY: 32,
    scaleZ: 0.001,
    abIgnore: true
})

if (configBot.tags.placeAsk) {
    ab.links.ask.abCoreMenuAction({message: configBot.tags.placeAsk, autoHatch: true});
}

const instName = configBot.tags.tempInst ?? configBot.tags.staticInst ?? configBot.tags.inst;
const egg = getBot(byTag("eggConfigurator", true), byTag("chosenEggName", instName));
if (egg) {
    egg.updateEggData();
    return;
}

const dimension = tags.dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;

//createEgg
const abArtifactShard = {
    data: {
        eggName: instName,
        eggStudio: configBot.tags.studio ?? authBot.id,
        eggConfigConfirmed: true,
        label: instName,
        studioId: configBot.tags.studio ?? authBot.id,
        eggParameters: {
            toolboxBot: getLink(thisBot),
            gridInformation: {
                dimension: dimension,
                position: {
                    x: -3,
                    y: 7
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

ab.links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'eggConfigurator',
    abArtifactInstanceID: uuid(),
    abArtifactShard,
});

ab.links.manifestation.abSetAwake({awake: true});