const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
let activeMenu = that?.menuPortal ?? configBot.tags.menuPortal ?? 'abMenu';
shout("abNavigationMenuRefresh");

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}]: showing nav for ${os.getCurrentInst()}`);
}

masks.navOpen = true;

if (configBot.tags.menuPortal != activeMenu) {
    configBot.tags.menuPortal = activeMenu;
}

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abNavigationMenuRefresh = "@ destroy(thisBot);";
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);
let studioName;
let studioId;

if (!ab.abIsPrimary()) {
    let studioData = await os.listUserStudios();
    if (studioData.success) {
        const studios = studioData.studios;
        for (let i = 0; i < studios.length; ++i) {
            let idString = studios[i].studioId;
            idString = idString.slice(0, 4);
            if (os.getCurrentInst().includes(idString)) {
                studioName = studios[i].displayName;
                studioId = studios[i]?.studioId;
            }
        }
    }

    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] studioName: ${studioName}, allowedLayers:`, ab.links.remember.tags.allowedLayers);
    }

    if (!studioName && ab.links.remember.tags.allowedLayers && ab.links.remember.tags.allowedLayers.length != 0) {

        const allowedLayer = ab.links.remember.tags.allowedLayers.find(layer => os.getCurrentInst().startsWith(layer.StudioId.slice(0, 4)));

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Checked allowedLayers for currentInst ${os.getCurrentInst()}. match:`, allowedLayer, `allowedLayers:`, ab.links.remember.tags.allowedLayers);
        }
        
        if (allowedLayer) {
            studioName = allowedLayer.DisplayName;
            studioId = allowedLayer.StudioId;
        }
    } 
} else {
    studioId = configBot.tags.studioId ?? authBot?.id;
}

const min = 2.100;
const max = 2.900;
const randomNumber = Math.random() * (max - min) + min;

const username = await ab.links.console.getUserName({ canSetPreferredName: false });

if (!ab.abIsPrimary()) {
    shout("abMenuRefresh");
}

const superNavDropdown = {
    ...menuOptions,
    label: ab.abIsPrimary() ? (username ? username + "'s places" : "user's places") : studioName ? studioName + ' places' : os.getCurrentInst() + ' places',
    dropdownSortOrder: Number(randomNumber.toFixed(3)),
    dropdownOptions: [],
    defaultOpen: ab.abIsPrimary() && that?.defaultOpenPlaces ? true : null,
    superNavId: studioId
}

let dropdownOptions = JSON.parse(await thisBot.createNavDropdown(that));
superNavDropdown.dropdownOptions = [...dropdownOptions];


if (superNavDropdown.dropdownOptions.length > 0) {
    const existingBots = getBots(byTag(activeMenu, true), byTag("superNavId", studioId));
    if (existingBots) {
        destroy(existingBots);
    }
   ab.links.menu.abCreateMenuDropdown(superNavDropdown); 
}