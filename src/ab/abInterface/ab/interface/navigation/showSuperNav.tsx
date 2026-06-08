const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abNavigationMenuRefresh = "@ destroy(thisBot);";
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

//TODO remove when more time
if (!ab.abIsPrimary()) {
    //grab studioData, use it to inform label
    return;
}
let studioData = await os.listUserStudios();

if (studioData.success) {
    const studios = studioData.studios;
    for (let i = 0; i < studios.length; ++i) {
        let idString = studios[i].studioId;
        idString = idString.slice(0, 4);
        
        const isLoaded = tags.activeInsts.find(item => item.includes(idString));
    }
}

const superNavDropdown = {
    ...menuOptions,
    label: ab.abIsPrimary() ? 'places' : os.getCurrentInst() + ' places',
    dropdownSortOrder: 2,
    dropdownOptions: []
}

let dropdownOptions = JSON.parse(await thisBot.createNavDropdown());
superNavDropdown.dropdownOptions = [...dropdownOptions];

ab.links.menu.abCreateMenuDropdown(superNavDropdown);