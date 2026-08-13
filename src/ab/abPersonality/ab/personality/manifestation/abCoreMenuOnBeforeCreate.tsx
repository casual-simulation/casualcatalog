const menuItems = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const logKit = {
    ...menuOptions,
    label: `nav kit`,
    formAddress: "article",
    onClick: ListenerString(() => {
        ab.links.manifestation.equipKit({kit: 'log'})
    }),  
}

const catalogKit = {
    ...menuOptions,
    label: `catalog kit`,
    formAddress: "cube",
    onClick: ListenerString(() => {
        ab.links.manifestation.equipKit({kit: 'catalog'})
    }),  
}
const defaultABKit = {
    ...menuOptions,
    label: `${abRemember.tags.defaultABKitName ?? 'casual kit'}`,
    formAddress: "category",
    onClick: ListenerString(() => {
        ab.links.manifestation.equipKit({kit: abRemember.tags.defaultABKit ?? 'casual_kit_loader'})
    }),  
}

if (tags.currentKit == 'log') {
    menuItems.push(catalogKit);
    menuItems.push(defaultABKit);
}

else if (tags.currentKit == 'catalog') {
    menuItems.push(logKit);
    menuItems.push(defaultABKit);
}

else if (tags.currentKit == abRemember.tags.defaultABKit) {
    menuItems.push(logKit);
    menuItems.push(catalogKit);
} 

else {
    menuItems.push(logKit);
    menuItems.push(catalogKit);
    menuItems.push(defaultABKit);
}

masks.menuItems = menuItems;