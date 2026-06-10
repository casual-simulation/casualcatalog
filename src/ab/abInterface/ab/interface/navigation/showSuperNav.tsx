const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
let activeMenu = configBot.tags.menuPortal;

console.log(`[${tags.system}.${tagName}]: showing nav for ${os.getCurrentInst()}`);

masks.navOpen = true;

if (!ab.abIsPrimary()) {
    configBot.tags.menuPortal = 'abMenu';
    activeMenu = 'abMenu';
}

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abNavigationMenuRefresh = "@ destroy(thisBot);";
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);
let studioName;

if (!ab.abIsPrimary()) {
    let studioData = await os.listUserStudios();
    if (studioData.success) {
        const studios = studioData.studios;
        for (let i = 0; i < studios.length; ++i) {
            let idString = studios[i].studioId;
            idString = idString.slice(0, 4);
            if (os.getCurrentInst().includes(idString)) {
                studioName = studios[i].displayName;
            }
        }
    }

    if (!studioName && ab.links.remember.tags.allowedLayers && ab.links.remember.tags.allowedLayers.length != 0) {

        const allowedLayer = ab.links.remember.tags.allowedLayers.find(layer => os.getCurrentInst().startsWith(layer.StudioId.slice(0, 4)));

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] Checked allowedLayers for currentInst ${os.getCurrentInst()}. match:`, allowedLayer, `allowedLayers:`, ab.links.remember.tags.allowedLayers);
        }
        
        if (allowedLayer) {
            studioName = allowedLayer.DisplayName;
        }
    } 
}

const min = 2.100;
const max = 2.900;
const randomNumber = Math.random() * (max - min) + min;

const superNavDropdown = {
    ...menuOptions,
    label: ab.abIsPrimary() ? 'places' : studioName ? studioName + ' places' : os.getCurrentInst() + ' places',
    dropdownSortOrder: Number(randomNumber.toFixed(3)),
    dropdownOptions: []
}

let dropdownOptions = JSON.parse(await thisBot.createNavDropdown());
superNavDropdown.dropdownOptions = [...dropdownOptions];

if (!ab.abIsPrimary()) {
    shout("abMenuRefresh");
}
if (superNavDropdown.dropdownOptions.length > 0) {
   ab.links.menu.abCreateMenuDropdown(superNavDropdown); 
}