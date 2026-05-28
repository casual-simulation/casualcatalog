let prompt;
let target;
let dimension;
if (that && that.prompt && that.target && that.dimension) {
    prompt = that.prompt;
    target = that.target;
    dimension = that.dimension;
} else {
    prompt = await os.showInput('', {
        title: "describe this place"
    })
}

if (!prompt) {
    os.toast("You must provide a description.");
    return;
}

tags.placePrompt = prompt;

configBot.tags.menuPortal = "storyPlaceLoading";
let loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: "Naming sim place",
    storyPlaceLoading: true
});

tags.skyboxGenerating = true;

let response;

if (!target) {
    const chatStream1 = await ai.stream.chat({
        role: 'user',
        content: [
            {
                text: `return ONLY a short label (3 words maximum) for a skybox that will be generated with this description: ${prompt}.
                    RESPONSE EXAMPLE: "Field of Daisies"
                `
            }
        ]
    }, 
    {
        preferredModel: abPersonality.tags.abPreferredAIModel
    });

    const contentChunks: string[] = [];
    let streamRole: string;

    const processNext = async (iter: AsyncIterator<any>): Promise<void> => {
        const { value: message, done } = await iter.next();
        if (done) return;
        if (message.role) {
            streamRole = message.role;
        }
        if (message.content) {
            contentChunks.push(message.content);
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] response chunk received...`);
            }
            if (typeof onPartialResponse === 'function') {
                onPartialResponse(message);
            }
        }
        await processNext(iter);
    };
    await processNext(chatStream1[Symbol.asyncIterator]());

    let aiResponse = {
        role: streamRole ?? 'assistant',
        content: contentChunks.join('')
    };

    if (aiResponse.content) {
        tags.label = aiResponse.content;
        target = aiResponse.content;
        dimension = aiResponse.content;
        dimension = dimension.replace(/[^a-zA-Z0-9]/g, '');
        dimension = dimension.toLowerCase();
        tags.chosenDimension = dimension;
    } else {
        os.toast("error generating name for sim place.");
        destroy(loadingBar);
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

if (tags.useCache) {
    destroy(loadingBar);
    loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
        label: "Choosing placeholder skybox",
        storyPlaceLoading: true
    });

     const chatStream2 = await ai.stream.chat({
        role: 'user',
        content: [
            {
                text: `return ONLY the name of a skybox from the following list that most closely matches this description: ${prompt}.
                    skybox list: ["clear_blue_sky", "starry_night_sky", "city_street", "underground_cave", "business_lobby", "medical_exam_room", "underwater", "factory_warehouse", "server_room", "office_space"]
                    RESPONSE EXAMPLE: clear_blue_sky
                `
            }
        ]
    }, 
    {
        preferredModel: abPersonality.tags.abPreferredAIModel
    });

    const contentChunks: string[] = [];
    let streamRole: string;

    const processNext = async (iter: AsyncIterator<any>): Promise<void> => {
        const { value: message, done } = await iter.next();
        if (done) return;
        if (message.role) {
            streamRole = message.role;
        }
        if (message.content) {
            contentChunks.push(message.content);
            if (tags.debug) {
                console.log(`[${tags.system}.${tagName}] response chunk received...`);
            }
            if (typeof onPartialResponse === 'function') {
                onPartialResponse(message);
            }
        }
        await processNext(iter);
    };
    await processNext(chatStream2[Symbol.asyncIterator]());

    let aiResponse = {
        role: streamRole ?? 'assistant',
        content: contentChunks.join('')
    };

    console.log("[simPlace]: chosen cached skybox (" + aiResponse.content + ")");

    if (aiResponse.content) {
        tags.color = null;
        tags.formAddress = tags.cachedSkyboxes[aiResponse.content]
    }
    
    tags.skyboxGenerating = false;
    setTagMask(thisBot, "activeSkybox", true, "shared");
    
}

const skybox = create({
        form: 'skybox',
        formAddress: tags.useCache ? tags.cachedSkyboxes[aiResponse.content ?? 'clear_blue_sky'] : null,
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

tags.skybox = getLink(skybox);

thisBot.makeMiniSkybox();

destroy(loadingBar);
loadingBar = ab.links.menu.abCreateMenuBusyIndicator({
    label: 'Generating sim place',
    storyPlaceLoading: true
});

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

if (skyboxImage) {
    links.skybox.tags.formAddress = skyboxImage;
    links.miniSkybox.tags.formAddress = skyboxImage;
    links.miniSkybox.tags.color = null;
    tags.formAddress = skyboxImage;

    const doors = getBots(byTag("simDoor", true), byTag("destination", tags.simID));
    for (let i = 0; i < doors.length; ++i) {
        doors[i].tags.formAddress = skyboxImage;
    }
}

tags.skyboxGenerating = false;
setTagMask(thisBot, "activeSkybox", true, "shared");
destroy(loadingBar); 

shout("onStorySceneChange", target);

shout("onSimPlaceSkyboxLoaded", thisBot);