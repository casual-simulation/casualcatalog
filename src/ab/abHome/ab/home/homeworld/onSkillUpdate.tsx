//prevent automatic map focus
setTagMask(ab.links.remember, "mapPreventFocus", true);

const currentDim = 'home';
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";

ab.links.manifestation.abSetAwake({ awake: true })

if (currentPortal != 'map') {
    configBot.tags.mapPortal = currentDim;
}

//Check login
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
            thisBot.saveHomeworld();
        }
    } else if (homeEggData.errorCode && homeEggData.errorCode == 'data_not_found') {
        thisBot.saveHomeworld();
    }
}

await thisBot.handleCatalogSetup();

// Manually call homeworld's onPortalChanged so it sets up the intro state.
thisBot.onPortalChanged({ portal: 'mapPortal', dimension: currentDim });