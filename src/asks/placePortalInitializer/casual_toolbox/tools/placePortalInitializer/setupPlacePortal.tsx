//set color

//add grid

//add back button

// //add avatar
// const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));

// if (!avatarBot) {
//     //get user location if applicable
//     let posX = 5;
//     let posY = 5;

//     const abArtifactShard = {
//         data: {
//             eggParameters: {
//                 gridInformation: {
//                     dimension: 'home',
//                     position: {
//                         x: posX,
//                         y: posY
//                     }
//                 }
//             }
//         },
//         dependencies: [
//             {
//                 askID: 'mapAvatar'
//             }
//         ]
//     };
//     await ab.links.artifact.abCreateArtifactPromiseBot({
//         space: 'tempShared',
//         abArtifactName: 'mapAvatar',
//         abArtifactInstanceID: uuid(),
//         abArtifactShard,
//     });
// }

// gridPortalBot.tags.portalColor = configBot.tags.portalColor ?? abPersonality.tags.abBaseColor ?? null;
const formAdd = ab?.abBuildCasualCatalogURL("/asks/place-assets/grid_textureMesh_01.glb");

const grid = create({
    color: 'white',
    formAddress: formAdd,
    formOpacity: 0.1,
    formSubtype: 'gltf',
    form: 'mesh',
    home: true,
    homeX: 0.5,
    homeY: -0.5,
    homeZ: -0.01,
    pointable: false,
    scaleX: 8,
    scaleY: 8,
    scaleZ: 0.001,
    abIgnore: true
})

if (configBot.tags.placeAsk) {
    ab.links.ask.abCoreMenuAction({message: configBot.tags.placeAsk, autoHatch: true});
}

ab.links.manifestation.abSetAwake({awake: true});