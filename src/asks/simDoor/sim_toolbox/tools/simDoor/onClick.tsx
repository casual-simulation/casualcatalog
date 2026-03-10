if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearSimDoorMenu");

configBot.tags.menuPortal = 'simDoor_menu';

const menuOptions = {
    simDoor_menu: true,
    clearSimDoorMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@destroy(thisBot);",
    door: getLink(thisBot)
}

const chooseExitButton = {
    ...menuOptions,
    label: 'choose destination',
    defaultOpen: true,
    simDoor_menuSortOrder: 1,
    dropdownSortOrder: 1
}

const options = [];
const places = getBots("simPlace", true);
for (let i = 0; i < places.length; ++i) {
    const tempDropdown = {
        ...menuOptions,
        label: places[i].tags.label,
        place: getLink(places[i]),
        onClick:  `@
            links.door.tags.destination = links.place.tags.simID;
            links.door.tags.label = links.place.tags.label;
            links.door.tags.color = null;
            links.door.tags.form = "sphere";
            links.door.tags.formAddress = links.place.tags.formAddress;
            links.door.tags.scaleX = 2;
            links.door.tags.scaleY = 2;
            links.door.tags.scaleZ = 2;
            links.door.makeMiniSkybox();
            shout("clearSimDoorMenu");
        `
    }

    options.push(tempDropdown);
}

chooseExitButton.dropdownOptions = options;

// const travelButton = {
//     ...menuOptions,
//     label: 'travel to: ' + tags.label ?? '',
//     place: getLink(getBot("simID", tags.destination)),
//     simDoor_menuSortOrder: 1,
//     onClick: `@
//         shout("activateStoryPlaceSkybox", links?.place?.tags.formAddress);
//     `
// }

if (!tags.destination) {
    if (options.length == 0) {
        os.toast("no destinations found");
    } else {
    ab.links.menu.abCreateMenuDropdown(chooseExitButton); 
    }
} else {
    const place = getBot("simID", tags.destination);
    shout("activateStoryPlaceSkybox", place.tags.formAddress);
    // ab.links.menu.abCreateMenuButton(travelButton);
}