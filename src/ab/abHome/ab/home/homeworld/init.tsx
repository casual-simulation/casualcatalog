//prevent automatic map focus
setTagMask(links.remember, "mapPreventFocus", true);

const currentDim = 'home';
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";

if (thisBot.isInPrimary()) {
    links.manifestation.abSetAwake({ awake: true })
}

configBot.tags.mapPortal = currentDim;

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

await thisBot.handleCatalogSetup();

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

// Manually call homeworld's onPortalChanged so it sets up the intro state.
thisBot.onPortalChanged({ portal: 'mapPortal', dimension: currentDim });