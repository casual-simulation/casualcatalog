const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

// if (currentPortal != 'map') {
//     thisBot.masks.abCoreMenuHide = true;
// } else {
//     thisBot.masks.abCoreMenuHide = false;
// }

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

let studioData = await os.listUserStudios();

if (!tags.activeInsts) {
    setTagMask(thisBot, "activeInsts", []);
}

if (studioData.success) {
    const studios = studioData.studios;
    for (let i = 0; i < studios.length; ++i) {
        let idString = studios[i].studioId;
        idString = idString.slice(-4);
        const instName = "sti_" + idString;
        
        const isLoaded = tags.activeInsts.includes(instName);

        dropdownOptions.push( {
            ...menuOptions,
            label: studios[i].displayName.toLocaleLowerCase(),
            studioData: studios[i],
            formAddress: isLoaded ? 'radio_button_checked' : 'radio_button_unchecked',
            onClick: `@
                links.skillBot.toggleLayer(tags.studioData);
                shout('clearHomePlaceMenu');
            `
        })
    }
}

if (dropdownOptions.length == 0) {
    thisBot.masks.abShowMenuHide = true;
} else {
    thisBot.masks.abShowMenuHide = false;
}

masks.dropdownOptions = dropdownOptions;

return;