if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    place: getLink(thisBot)
}

const genDesktopButton = {
    ...menuOptions,
    formAddress: tags.desktopGeneration ? 'toggle_on' : 'toggle_off',
    label: 'generate for desktop',
    abMenuSortOrder: -2,
    onClick: `@
        links.place.tags.desktopGeneration = !links.place.tags.desktopGeneration;
        tags.formAddress = links.place.tags.desktopGeneration ? 'toggle_on' : 'toggle_off'
    `
}

const createDoorButton = {
    ...menuOptions,
    formAddress: 'sensor_door',
    label: 'create door',
    abMenuSortOrder: -1,
    onClick: `@
        links.place.tags.choosingDoor = true;
        shout('abMenuRefresh');
    `
}

const clearDoorsButton = {
    ...menuOptions,
    formAddress: 'replay',
    label: 'remove all doors',
    onClick: `@
        links.place.tags.doors = null;
        links.place.tags.lineTo = null;
        const doors = getBots(byTag("simDoor", true), byTag(links.place.tags.chosenDimension, true));
        destroy(doors);
        shout("doorRemoved", links.place.tags.simID);
        shout('abMenuRefresh');
    `
}

ab.links.menu.abCreateMenuButton(genDesktopButton);
ab.links.menu.abCreateMenuButton(createDoorButton);
ab.links.menu.abCreateMenuButton(clearDoorsButton);