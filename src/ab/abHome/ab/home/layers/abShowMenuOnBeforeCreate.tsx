const dropdownOptions = [];

const currentDim = links.remember.tags.abActiveDimension;
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
        idString = idString.slice(0, 4);
        
        const isLoaded = tags.activeInsts.find(item => item.includes(idString));

        if (abRemember.tags.allowedLayers && abRemember.tags.allowedLayers.length != 0) {
            if (abRemember.tags.allowedLayers?.find(layer => layer.StudioId == studios[i].studioId)) {
                if (!abRemember.tags.allowedLayers?.find(layer => layer.StudioId == studios[i].studioId).Enabled) {
                    continue;
                }
            }
        }

        dropdownOptions.push( {
            ...menuOptions,
            label: studios[i].displayName.toLocaleLowerCase(),
            studioData: studios[i],
            formAddress: isLoaded ? 'radio_button_checked' : 'radio_button_unchecked',
            onClick: `@
                links.skillBot.toggleLayer(tags.studioData);
                shout('abMenuRefresh');
            `
        })
    }
}

if (abRemember.tags.allowedLayers && abRemember.tags.allowedLayers.length != 0) {
    for (let i = 0; i < abRemember.tags.allowedLayers.length; ++i) {
        if (abRemember.tags.allowedLayers[i].Enabled) {
            if (dropdownOptions.find(layer => layer.studioData?.studioId == abRemember.tags.allowedLayers[i].StudioId)) {
                continue;
            } else {
                let idString = abRemember.tags.allowedLayers[i].StudioId;
                idString = idString.slice(0, 4);
                const isLoaded = tags.activeInsts.find(item => item.includes(idString));
                
                dropdownOptions.push( {
                    ...menuOptions,
                    label: abRemember.tags.allowedLayers[i].DisplayName ?? abRemember.tags.allowedLayers[i].StudioId,
                    studioData: {
                        studioId: abRemember.tags.allowedLayers[i].StudioId
                    },
                    formAddress: isLoaded ? 'radio_button_checked' : 'radio_button_unchecked',
                    onClick: `@
                        links.skillBot.toggleLayer(tags.studioData);
                        shout('abMenuRefresh');
                    `
                })
            }
        }
    }
}

if (dropdownOptions.length == 0) {
    thisBot.masks.abShowMenuHide = true;
} else {
    thisBot.masks.abShowMenuHide = false;
}

masks.dropdownOptions = dropdownOptions;

return;