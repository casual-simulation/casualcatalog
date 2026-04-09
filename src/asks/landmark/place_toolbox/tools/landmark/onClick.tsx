if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout('clearLandmarkMenu');

configBot.tags.menuPortal = 'landmark_menu';

const menuOptions = {
    landmark_menu: true,
    clearLandmarkMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    place: getLink(thisBot)
}

const nameButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'name this landmark',
    landmark_menuSortOrder: 1,
    onClick: `@
        const newName = await os.showInput(links.place.tags.landmarkName ?? '', {
        autoSelect: true,
        title: 'Name this landmark'
    });

    links.place.tags.landmarkName = newName;
    links.place.tags.label = newName;
    
    links.place.onClick();
    `
}

const addLinkButton = {
    ...menuOptions,
    formAddress: 'link',
    label: 'add a link',
    landmark_menuSortOrder: 2,
    onClick: `@
        const link = await os.showInput(links.place.tags.landmarkLink ?? '', {
        autoSelect: true,
        title: 'add a link'
    });
    
    links.place.tags.landmarkLink = link;
    
    links.place.onClick();
    `
}

const lockButton = {
    ...menuOptions,
    formAddress: 'lock',
    label: 'lock landmark',
    landmark_menuSortOrder: 3,
    onClick: `@
        links.place.tags.landmarkLocked = true;
        links.place.onClick();
    `
}

const nameTag = {
    ...menuOptions,
    label: tags.landmarkName,
    color: ab.links.personality.tags.abBaseMenuColor,
    landmark_menuSortOrder: 1
}

const visitLinkButton = {
    ...menuOptions,
    formAddress: 'link',
    label: tags.landmarkLink,
    landmark_menuSortOrder: 2,
    onClick: `@
        os.openURL(links.place.tags.landmarkLink);
        shout('clearLandmarkMenu');
    `
}

const visitButton = {
    ...menuOptions,
    formAddress: 'check_circle',
    label: 'check in',
    landmark_menuSortOrder: 1,
    onClick: `@
        links.place.checkIn();
        shout('clearLandmarkMenu');
    `
}

const journal = getBot("artifactJournal", true);

if (!tags.landmarkLocked) {
    ab.links.menu.abCreateMenuButton(nameButton);
    ab.links.menu.abCreateMenuButton(addLinkButton);
    ab.links.menu.abCreateMenuButton(lockButton);
} else if (!tags.discovered && journal?.tags?.continueLocationPull) {
    ab.links.menu.abCreateMenuButton(visitButton);
    shout("onLandmarkClicked", tags.landmarkID);
} else {
    shout("onLandmarkClicked", tags.landmarkID);
    const landmarkInfoMenu = getBot("name", "landmarkInfoMenu");
    if (landmarkInfoMenu) {
        landmarkInfoMenu.openApp(tags.landmarkID);
    }
}