const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abNavigationMenuRefresh = "@ destroy(thisBot);";
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const superNavDropdown = {
    ...menuOptions,
    label: ab.abIsPrimary() ? 'places' : os.getCurrentInst() + ' places',
    dropdownSortOrder: 2,
    dropdownOptions: []
}

let dropdownOptions = JSON.parse(await thisBot.createNavDropdown());
superNavDropdown.dropdownOptions = [...dropdownOptions];

ab.links.menu.abCreateMenuDropdown(superNavDropdown);