//that is a string for asking the ai
const prompt = that;
thisBot.makeLoadingMenu();

let skyboxImage = await ai.generateSkybox(prompt);
// let skyboxImage = "https://images.blockadelabs.com/images/imagine/Advanced_no_style_equirectangular-jpg_Show_me_the_mountains_2228630042_13764412.jpg?ver=1";
console.log(skyboxImage);
thisBot.resetSkyboxMenu();

const dimension = configBot.tags.gridPortal;
const skyboxParameters = {
    "skyboxImage": skyboxImage,
    "skyboxTags": {
        scale: 450,
        [dimension + "Z"]: -100,
        onInstJoined: tags.instJoinedString
    }
}

// let skybox = await shout("hatch", { abID: "msSkyBot", recordKey: "6db28ddc-1835-4fb4-8ed3-5ccf26c02217", autoHatch: true, eggParameters: skyboxParameters });

// ab.links.search.onLookupAskID({
//     askID: "msSkyBot",
//     eggParameters: {
//         toolboxBot: tags.toolbox ?? "",
//         gridInformation: tags.gridInformation,
//         skyboxImage: skyboxImage,
//         skyboxTags: {
//             scale: 450,
//             [dimension + "Z"]: -100,
//             onInstJoined: tags.instJoinedString
//         }
//     },
// })

links.artifact.abCreateArtifactPromiseBot({
    abArtifactName: 'msSkyBot',
    abArtifactInstanceID: uuid(),
    abArtifactShard: {
        data: {
            toolboxBot: tags.toolbox ?? "",
            gridInformation: tags.gridInformation,
            skyboxImage: skyboxImage,
            skyboxTags: {
                scale: 450,
                [dimension + "Z"]: -100,
                onInstJoined: tags.instJoinedString
            }
        },
        dependencies: [
            { askID: 'msSkyBot' }
        ]

    }
})

gridPortalBot.tags.portalCameraType = "perspective";
gridPortalBot.tags.portalPannableMaxX = 30;
gridPortalBot.tags.portalPannableMinX = -30;
gridPortalBot.tags.portalPannableMaxY = 30;
gridPortalBot.tags.portalPannableMinY = -30;
gridPortalBot.tags.portalZoomable = false;

destroy(thisBot);