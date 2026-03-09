if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

const doorBot = getBot("choosingDoor", true);

if (doorBot) {
    if (doorBot == thisBot) {
        tags.choosingDoor = false;
    } else {
        doorBot.addDoor(thisBot);
        thisBot.addDoor(doorBot);
        tags.color = tags.prevColor;
        tags.prevColor = null;
        return;
    }
}

if (tags.skyboxGenerating == true) {
    os.toast("skybox generating...");
    return;
}

if (tags.formAddress) {
    shout("activateStoryPlaceSkybox", tags.formAddress);
} else {
    shout('abMenuRefresh');
    shout("clearSimPlaceMenu");

    configBot.tags.menuPortal = 'simPlace_menu';

    const menuOptions = {
        simPlace_menu: true,
        clearSimPlacenMenu: `@destroy(thisBot);`,
        abMenuRefresh: "@ destroy(thisBot);",
        place: getLink(thisBot)
    }

    const manualButton = {
        ...menuOptions,
        label: 'manually input skybox information',
        formAddress: 'edit',
        simPlace_menuSortOrder: 1,
        onClick: `@
            links.place.createSkybox();
            shout("clearSimPlaceMenu");
        `
    }

    const cameraButton = {
        ...menuOptions,
        label: 'use camera to create skybox',
        formAddress: 'photo_camera',
        simPlace_menuSortOrder: 2,
        onClick: `@
            links.place.parseImage();
            shout("clearSimPlaceMenu");
        `
    }

    ab.links.menu.abCreateMenuButton(manualButton);
    ab.links.menu.abCreateMenuButton(cameraButton);
}