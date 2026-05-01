if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] that:`, that);
}

tags.abIgnore = true;

// Immediately disable automatic map camera animation from manifestation bot.
setTagMask(links.remember, "mapPreventFocus", true);

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";

ab.links.manifestation.abSetAwake({ awake: true })

if (currentPortal != 'map') {
    configBot.tags.mapPortal = currentDim;
}

if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] authBot not found`);
    }
    await os.requestAuthBotInBackground();
}

if (!authBot) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] User not logged in.`);
    }
    return;
}

if (that.eggParameters && that.eggParameters.saveOnLoad) {
    await thisBot.handleStudioStationSetup();
    thisBot.saveData();
    thisBot.onPortalChanged({ portal: 'mapPortal', dimension: currentDim });
    return;
}

const studio = configBot.tags.studio ?? authBot.id;
const homeEggData = await os.getData(studio, 'home');

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] homeEggData`, homeEggData, studio);
}

if (!homeEggData.success) {
    if(homeEggData.errorCode && homeEggData.errorCode == 'not_authorized') {
        const permissions = await os.grantInstAdminPermission(studio);
        const homeEggData2 = await os.getData(studio, 'home');

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] homeEggData2`, homeEggData2, permissions);
        }
        
        if (!homeEggData2.success) {
            thisBot.saveData();
        }
    } else if (homeEggData.errorCode && homeEggData.errorCode == 'data_not_found') {
        thisBot.saveData();
    }
}

if (tags.abArtifactName && !tags.abArtifactInstanceID) {
    // Turn the home ask into an artifact instance if it isnt one already upon load.
    tags.abArtifactInstanceID = uuid();

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] turning home world into artifact instance ${tags.abArtifactInstanceID}`);
    }

    ab.links.artifact.abUpdateArtifactShards({
        abArtifactName: tags.abArtifactName,
        abArtifactInstanceID: tags.abArtifactInstanceID
    })
}

await thisBot.handleStudioStationSetup();

// Manually call homeworld's onPortalChanged so it sets up the intro state.
thisBot.onPortalChanged({ portal: 'mapPortal', dimension: currentDim });