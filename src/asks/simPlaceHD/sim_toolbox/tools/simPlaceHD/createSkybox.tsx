let prompt = that.prompt ?? that;
let target = that.target;
let dimension = that.dimension;
const usingImage = that.usingImage;
const isUpload = that.isUpload;

if (!prompt) {
    os.toast("You must provide a description.");
    return;
}

tags.placePrompt = JSON.stringify(prompt);

tags.skyboxGenerating = true;

let skyboxName;
if (!target) {
    if (usingImage) {
        skyboxName = await thisBot.summarizeImage({prompt: prompt, isUpload: isUpload});
        if (skyboxName) {
            skyboxName = skyboxName.name;
        }
    } else {
        skyboxName = await thisBot.generateName(prompt); 
    }

    if (skyboxName) {
        tags.label = skyboxName;
        target = skyboxName;
        dimension = skyboxName;
        dimension = dimension.replace(/[^a-zA-Z0-9]/g, '');
        dimension = dimension.toLowerCase();
        tags.chosenDimension = dimension;
    } else {
        os.toast("error generating name for sim place.");
        destroy(loadingBar);
        tags.skyboxGenerating = false;
        return;
    }
} else {
    tags.label = target;

    if (!dimension) {
        dimension = target;
        dimension = dimension.replace(/[^a-zA-Z0-9]/g, '');
        dimension = dimension.toLowerCase();
    }
    
    tags.chosenDimension = dimension;
}

configBot.tags.menuPortal = "storyPlaceLoading";
let loadingBar = await ab.links.menu.abCreateMenuBusyIndicator({
    label: "Creating skybox",
    storyPlaceLoading: true
});

// if (tags.useCache) {
//     destroy(loadingBar);
//     loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
//         label: "Choosing placeholder skybox",
//         storyPlaceLoading: true
//     });

//     response = await ai.chat({
//         role: 'user',
//         content: [
//             {
//                 text: `return ONLY the name of a skybox from the following list that most closely matches this description: ${prompt}.
//                     skybox list: ["clear_blue_sky", "starry_night_sky", "city_street", "underground_cave", "business_lobby", "medical_exam_room", "underwater", "factory_warehouse", "server_room", "office_space"]
//                     RESPONSE EXAMPLE: clear_blue_sky
//                 `
//             }
//         ]
//     }, 
//     {
//         preferredModel: abPersonality.tags.abPreferredAIModel
//     });

//     console.log("[simPlace]: chosen cached skybox (" + response.content + ")");

//     if (response.content) {
//         tags.color = null;
//         tags.formAddress = tags.cachedSkyboxes[response.content]
//     }
    
//     tags.skyboxGenerating = false;
//     setTagMask(thisBot, "activeSkybox", true, "shared");
    
// }

const skybox = create({
    form: 'mesh',
    formSubtype: 'splat',
    formAddress: null,
    pointable: false,
    focusable: false,
    scaleMode: 'absolute',
    meshPositioningMode: 'absolute',
    anchorPoint: 'center',
    scale: tags.desktopGeneration ? 1: 5,
    [dimension + 'X']: 0,
    [dimension + 'Y']: 0,
    [dimension + 'Z']: tags.desktopGeneration ? 0: 4,
    [dimension]: true,
    system: 'sim_toolbox.genBots.splatSkybox',
    abIgnore: true
});

tags.skybox = getLink(skybox);

thisBot.makeMiniSkybox();

destroy(loadingBar);
let skyboxImage;
try {
    if (usingImage) {
        skyboxImage = await thisBot.generateFromImage({name: target, image: prompt, isUpload: isUpload});
    } else {
       skyboxImage = await thisBot.generateWorld({name: target, prompt: prompt}); 
    }
} catch (e) {
    tags.color = 'red';
    tags.skyboxGenerating = false;

    os.toast("skybox generation failed", e);
    tags.error = e;
    return;
}

if (skyboxImage && links.skybox && links.miniSkybox) {
    links.skybox.tags.formAddress = skyboxImage;
    links.miniSkybox.tags.formAddress = skyboxImage;
    links.miniSkybox.tags.color = null;
    tags.formAddress = skyboxImage;
    tags.color = "clear";
    tags.form = "mesh";
    tags.strokeColor = null;

    const doors = getBots(byTag("simDoor", true), byTag("destination", tags.simID));
    for (let i = 0; i < doors.length; ++i) {
        doors[i].tags.formAddress = skyboxImage;
    }
} else {
    os.toast("Failed to set splat formAddress");
}

tags.skyboxGenerating = false;
setTagMask(thisBot, "activeSkybox", true, "shared");

shout("onStorySceneChange", target);

shout("onSimPlaceSkyboxLoaded", thisBot);