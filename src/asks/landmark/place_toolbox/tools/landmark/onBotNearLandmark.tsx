if (that.landmarkID == tags.landmarkID && that.bot.tags.mapAvatar == true && that.bot.tags.remoteID == getID(configBot)) {
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
        label: 'check in',
        landmark_menuSortOrder: 1,
        onClick: `@
            links.place.checkIn();
            shout('clearLandmarkMenu');
        `
    }

    ab.links.menu.abCreateMenuButton(visitButton);
}