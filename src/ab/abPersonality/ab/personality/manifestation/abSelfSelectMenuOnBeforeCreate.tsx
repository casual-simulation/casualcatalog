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
    label: `log`,
    formAddress: "article",
    onClick: ListenerString(() => {
        ab.links.manifestation.equipKit({kit: 'log'})
    }),  
}

const catalogKit = {
    ...menuOptions,
    label: `catalog`,
    formAddress: "cube",
    onClick: ListenerString(() => {
        ab.links.manifestation.equipKit({kit: 'catalog'})
    }),  
}
const defaultKit = {
    ...menuOptions,
    label: `${abRemember.tags.defaultKitName ?? 'casual kit'}`,
    formAddress: "category",
    onClick: ListenerString(() => {
        ab.links.manifestation.equipKit({kit: abRemember.tags.defaultKit ?? 'casual_kit_loader'})
    }),  
}

if (tags.currentKit == 'log') {
    menuItems.push(catalogKit);
    menuItems.push(defaultKit);
}

else if (tags.currentKit == 'catalog') {
    menuItems.push(logKit);
    menuItems.push(defaultKit);
}

else if (tags.currentKit == abRemember.tags.defaultKit) {
    menuItems.push(logKit);
    menuItems.push(catalogKit);
} 

else {
    menuItems.push(logKit);
    menuItems.push(catalogKit);
    menuItems.push(defaultKit);
}

masks.menuItems = menuItems;