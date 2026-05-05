if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');

configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'home_place_menu';

const BASE_MENU_TAGS = {
    home_place_menu: true,
    clearHomePlaceMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    place: getLink(thisBot)
}

if (tags.studioId) {
    const moveToPlaceButton = {
        ...BASE_MENU_TAGS,
        label: 'places',
        dropdownSortOrder: 5,
        defaultOpen: true,
        dropdownOptions: [],
    }

    const homeBaseBot = getBot(byTag("studioCatalog", true), byTag('respawnPoint', true));

    const homeButton = {
        ...BASE_MENU_TAGS,
        label: homeBaseBot?.tags.placeLabel ?? 'home',
        formAddress: 'https://auth-aux-dev-filesbucket-682397690660.s3.amazonaws.com/318c04f1-1391-4c10-8d43-aaebc5170265/cd38affc0604beaa588da21aa1be750bb3e73b3b3cae23eb30307c34494459f3.png',
        onClick: `@const homeBot = getBot(byTag("studioCatalog", true), byTag('respawnPoint', true));
        if (homeBot) {
            os.focusOn(homeBot);
        }
        shout("abMenuRefresh");
        `
    };

    if (tags.studioId != authBot?.id && homeBaseBot) {
        moveToPlaceButton.dropdownOptions.push(homeButton);
    }

    const placesArr = [];
    const places = getBots("homePlace", true);
    for (const hPlace of places) {
        if (hPlace.tags.homeBase == true || hPlace == thisBot) {
            continue;
        }
        const placeObj = {
            ...BASE_MENU_TAGS,
            label: hPlace.tags.placeLabel,
            formAddress: 'location_on',
            place: getLink(hPlace),
            onClick: `@
                if (links.place) {
                    os.focusOn(links.place);
                }
                shout("abMenuRefresh");
            `
        }

        placesArr.push(placeObj);
    }

    placesArr.sort((a, b) => {
        const nameA = a.label.toUpperCase();
        const nameB = b.label.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    for (const sortedPlace of placesArr) {
        moveToPlaceButton.dropdownOptions.push(sortedPlace);
    }

    const currentLocationButton = {
        ...BASE_MENU_TAGS,
        skillBot: tags.navigation,
        label: 'current location',
        formAddress: 'near_me',
        onClick: `@
            links.skillBot.goToCurrentLocation();
            shout("abMenuRefresh");
        `
    }

    moveToPlaceButton.dropdownOptions.push(currentLocationButton);

    const shareButton = {
        ...BASE_MENU_TAGS,
        label: 'share',
        formAddress: 'ios_share',
        onClick: `@
            shout('clearHomePlaceMenu');
            links.place.onStoreMenu();
        `
    };

    ab.links.menu.abCreateMenuDropdown(moveToPlaceButton);
    ab.links.menu.abCreateMenuButton(shareButton);

    masks.selected = true;
} else {

    //STUDIO CHOICE
    const studioGroup = {
        ...BASE_MENU_TAGS,
        label: 'which studio catalog?',
        dropdownSortOrder: 1,
        defaultOpen: true,
        dropdownOptions: []
    }

    studioGroup.dropdownOptions.push( {
        ...BASE_MENU_TAGS,
        label: 'user studio',
        formAddress: 'radio_button_unchecked',
        studioData: {
            studioId: authBot?.id,
            displayName: 'user studio'
        },
        onClick: `@
            links.place.setStudio(tags.studioData);
            shout('clearHomePlaceMenu');
        `
    })   

    let studioData = await os.listUserStudios();

    if (studioData.success) {
        const studios = studioData.studios;
        for (let i = 0; i < studios.length; ++i) {
            studioGroup.dropdownOptions.push( {
                ...BASE_MENU_TAGS,
                label: studios[i].displayName.toLocaleLowerCase(),
                studioData: studios[i],
                formAddress: 'radio_button_unchecked',
                onClick: `@
                    links.place.setStudio(tags.studioData);
                    shout('clearHomePlaceMenu');
                `
            })
        }
    }
    ab.links.menu.abCreateMenuDropdown(studioGroup);
}