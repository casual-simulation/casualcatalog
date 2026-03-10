let prompt;
let target;
if (that && that.prompt && that.target) {
    prompt = that.prompt;
    target = that.target;
} else {
    target = await os.showInput('', {
        title: "name this place"
    })
    prompt = await os.showInput('', {
        title: "Describe this place"
    })
}

if (!target || !prompt) {
    os.toast("You must provide a name and description.");
    return;
}

tags.label = target;
tags.placePrompt = prompt;

configBot.tags.menuPortal = "storyPlaceLoading";
const loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "Generating story place",
    storyPlaceLoading: true
});

tags.skyboxGenerating = true;
let skyboxImage;
try {
    skyboxImage = await ai.generateSkybox(prompt,"nsfw",{blockadeLabs:{skyboxStyleId:143}});
} catch (e) {
    tags.color = 'red';
    destroy(loadingBar);
    tags.skyboxGenerating = false;   

    os.toast("skybox generation failed", e);
    return;
}

destroy(loadingBar);
 
tags.skyboxGenerating = false;
tags.color = null;
tags.formAddress = skyboxImage;

setTagMask(thisBot, "activeSkybox", true, "shared");

const dimension = configBot.tags.gridPortal;

const skybox = create({
    form: 'skybox',
    formAddress: skyboxImage,
    pointable: false,
    scale: 200,
    [dimension + 'X']: 0,
    [dimension + 'Y']: 0,
    [dimension]: true,
    anchorPoint: 'center',
    [dimension + "RotationX"]: 1.5708,
    system: 'story_toolbox.genBots.skybox',
    abIgnore: true
});

thisBot.makeMiniSkybox();
if (links.miniSkybox) {
    links.miniSkybox.tags.formAddress = skyboxImage;
    links.miniSkybox.tags.color = null;
}

tags.skybox = getLink(skybox);
// const artifactInstanceID = uuid();
// tags.artifactInstanceID = artifactInstanceID;

// links.artifact.abCreateArtifactPromiseBot({
//     abArtifactName: 'msSkyBot',
//     abArtifactInstanceID: artifactInstanceID,
//     abArtifactShard: {
//         data: {
//             toolboxBot: tags.toolbox ?? "",
//             gridInformation: tags.gridInformation,
//             skyboxImage: skyboxImage,
//             skyboxTags: {
//                 scale: 450,
//                 [dimension + "Z"]: -100,
//                 onInstJoined: tags.instJoinedString
//             }
//         },
//         dependencies: [
//             { askID: 'msSkyBot' }
//         ]

//     }
// })

shout("onStorySceneChange", target);

gridPortalBot.tags.portalCameraType = "perspective";