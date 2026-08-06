const menuItems = [];

const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const sleepButton = {
    ...menuOptions,
    label: `sleep`,
    formAddress: "nights_stay",
    onClick: ListenerString(() => {
        ab.links.manifestation.abSetAwake({ awake: false })
    }),  
}

const hideButton = {
    ...menuOptions,
    label: `hide`,
    formAddress: "visibility_off",
    onClick: ListenerString(() => {
        destroy(ab.links.manifestation.links.abBot);
    }),  
}

menuItems.push(hideButton);
menuItems.push(sleepButton);

masks.menuItems = menuItems;