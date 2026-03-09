if (tags.formAddress) {
     shout("activateStoryPlaceSkybox", tags.formAddress);
} else {
    shout('abMenuRefresh');
    shout("clearStoryPlaceMenu");

    configBot.tags.menuPortal = 'storyPlace_menu';

    const menuOptions = {
        storyPlace_menu: true,
        clearStoryPlaceMenu: `@destroy(thisBot);`,
        abMenuRefresh: "@ destroy(thisBot);",
        place: getLink(thisBot)
    }

    const manualButton = {
        ...menuOptions,
        label: 'manually input information',
        formAddress: 'edit',
        simPlace_menuSortOrder: 1,
        onClick: `@
            links.place.createSkybox();
            shout("clearStoryPlaceMenu");
        `
    }

    const cameraButton = {
        ...menuOptions,
        label: 'use camera to create skybox',
        formAddress: 'photo_camera',
        simPlace_menuSortOrder: 2,
        onClick: `@
            links.place.parseImage();
            shout("clearStoryPlaceMenu");
        `
    }

    ab.links.menu.abCreateMenuButton(manualButton);
    ab.links.menu.abCreateMenuButton(cameraButton);
}