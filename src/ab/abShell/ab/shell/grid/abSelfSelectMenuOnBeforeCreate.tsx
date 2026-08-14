const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const gridSnap = {
    ...menuOptions,
    label: "grid snap",
    onCreate: ListenerString(() => {
        tags.formAddress = links.remember.tags.abGridSnapState ? 'check_box' : 'check_box_outline_blank'
    }),
    onClick: ListenerString(() => {
        links.remember.tags.abGridSnapState = !links.remember.tags.abGridSnapState; tags.formAddress = links.remember.tags.abGridSnapState ? 'check_box' : 'check_box_outline_blank';
    }),
}

const botSnap = {
    ...menuOptions,
    label: "bot snap",
    onCreate: ListenerString(() => {
        tags.formAddress = links.remember.tags.abBotSnapState ? 'check_box' : 'check_box_outline_blank';
    }),
    onClick: ListenerString(() => {
        links.remember.tags.abBotSnapState = !links.remember.tags.abBotSnapState; tags.formAddress = links.remember.tags.abBotSnapState ? 'check_box' : 'check_box_outline_blank';
    }),
}

dropdownOptions.push(gridSnap);
dropdownOptions.push(botSnap);

masks.dropdownOptions = dropdownOptions;