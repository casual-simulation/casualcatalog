const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const resetGuide = {
    ...menuOptions,
    label: "reset",
    ask: getLink(ab.links.ask),
    onClick: ListenerString(() => {
        links.skillBot.resetGuide();
    })
};

const enableGuide = {
    ...menuOptions,
    label: `enabled`,
    formAddress: tags.abGuideEnabled ? 'toggle_on' : 'toggle_off',
    onClick: ListenerString(() => {
        links.skillBot.toggleGuide();
        shout('abMenuRefresh');
    }),
};

dropdownOptions.push(resetGuide);
dropdownOptions.push(enableGuide);

masks.dropdownOptions = dropdownOptions;