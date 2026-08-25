const menuItems = [];

const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const saveButton = {
    ...menuOptions,
    label: `save layer`,
    formAddress: "save",
    onClick: ListenerString(() => {
        links.skillBot.saveHomeworld(); 
        shout('abMenuRefresh'); 
    }),  
}

const setLocationButton = {
    ...menuOptions,
    label: `set default location`,
    formAddress: "pin_drop",
    onClick: ListenerString(() => {
        const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
        links.skillBot.setRespawnPoint({x: ab.links.manifestation.links.abBot.tags[dimension + 'X'], y: ab.links.manifestation.links.abBot.tags[dimension + 'Y']});
    }),  
}

menuItems.push(saveButton);
menuItems.push(setLocationButton);

masks.menuItems = menuItems;