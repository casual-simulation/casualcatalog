if (that.landmarkID == tags.landmarkID && that.bot == ab.links.manifestation.links.abBot) {
    that.bot.masks.nearLandmark = true;

    shout('abMenuRefresh');
    shout('clearLandmarkMenu');

    configBot.tags.menuPortal = 'landmark_menu';

    const menuOptions = {
        landmark_menu: true,
        clearLandmarkMenu: `@destroy(thisBot);`,
        abMenuRefresh: "@ destroy(thisBot);",
        place: getLink(thisBot)
    }
    
    const visitButton = {
        ...menuOptions,
        formAddress: 'check_circle',
        label: 'clock in',
        landmark_menuSortOrder: 1,
        onClick: `@
            links.place.checkIn();
            shout('clearLandmarkMenu');
        `
    }

    ab.links.menu.abCreateMenuButton(visitButton);
}