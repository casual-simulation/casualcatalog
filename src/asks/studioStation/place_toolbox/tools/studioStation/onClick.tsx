if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');

configBot.tags.menuPortal = 'home_place_menu';

const menuOptions = {
    home_place_menu: true,
    clearHomePlaceMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    place: getLink(thisBot)
}

//nav
const moveToPlaceButton = {
    ...menuOptions,
    label: 'place nav: ' + tags.placeLabel,
    dropdownSortOrder: 5,
    defaultOpen: true
}

const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

if (currentPortal != 'map') {
    return;
}

const homeBaseBot = getBot(byTag("studioStation", true), byTag('studioId', authBot?.id));

const homeButton = {
    ...menuOptions,
    label: homeBaseBot.tags.placeLabel ?? 'home',
    formAddress: 'https://auth-aux-dev-filesbucket-682397690660.s3.amazonaws.com/318c04f1-1391-4c10-8d43-aaebc5170265/cd38affc0604beaa588da21aa1be750bb3e73b3b3cae23eb30307c34494459f3.png',
    onClick: `@const homeBot = getBot(byTag("studioStation", true), byTag('studioId', authBot?.id));
    if (homeBot) {
        os.focusOn(homeBot);
    }
    shout("abMenuRefresh");
    `
};

if (tags.studioId != authBot?.id) {
    dropdownOptions.push(homeButton);
}


const placesArr = [];
const places = getBots("homePlace", true);
for (const hPlace of places) {
    if (hPlace.tags.homeBase == true || hPlace == thisBot) {
        continue;
    }
    const placeObj = {
        ...menuOptions,
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
    dropdownOptions.push(sortedPlace);
}


const currentLocationButton = {
    ...menuOptions,
    skillBot: tags.navigation,
    label: 'current location',
    formAddress: 'near_me',
    onClick: `@
        links.skillBot.goToCurrentLocation();
        shout("abMenuRefresh");
    `
}

dropdownOptions.push(currentLocationButton);

moveToPlaceButton["dropdownOptions"] = dropdownOptions;
ab.links.menu.abCreateMenuDropdown(moveToPlaceButton);