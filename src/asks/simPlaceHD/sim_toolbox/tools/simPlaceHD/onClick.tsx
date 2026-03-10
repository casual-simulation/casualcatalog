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
        simPlace_menuSortOrder: 2,
        // onClick: `@
        //     links.place.createSkybox();
        //     shout("clearSimPlaceMenu");
        // `,
        onSubmit: `@ 
            links.place.createSkybox(that.text);
            shout("clearSimPlaceMenu");
        `
    }

    const cameraButton = {
        ...menuOptions,
        label: 'use camera to create skybox',
        formAddress: 'photo_camera',
        simPlace_menuSortOrder: 3,
        onClick: `@
            links.place.parseImage();
            shout("clearSimPlaceMenu");
        `
    }

    const uploadButton = {
        ...menuOptions,
        label: 'upload an image to create skybox',
        formAddress: 'upload',
        simPlace_menuSortOrder: 4,
        onClick: `@
            links.place.uploadImage();
            shout("clearSimPlaceMenu");
        `
    }

    const resButton = {
        ...menuOptions,
        label: 'set resolution: ' + tags.resolution,
        simPlace_menuSortOrder: 1,
        dropdownSortOrder: 1,
        dropdownOptions: [
            {
                ...menuOptions,
                label: '100k',
                onClick: `@
                    links.place.tags.resolution = '100k';
                    links.place.onClick();
                `
            },
            {
                ...menuOptions,
                label: '500k',
                onClick: `@
                    links.place.tags.resolution = '500k';
                    links.place.onClick();
                `
            },
            {
                ...menuOptions,
                label: 'full_res',
                onClick: `@
                    links.place.tags.resolution = 'full_res';
                    links.place.onClick();
                `
            }
        ]
    }

    ab.links.menu.abCreateMenuDropdown(resButton);
    ab.links.menu.abCreateMenuInput(manualButton);
    ab.links.menu.abCreateMenuButton(cameraButton);
    ab.links.menu.abCreateMenuButton(uploadButton);

}