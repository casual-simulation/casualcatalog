if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');

configBot.masks.menuPortal = null;
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
    label: 'places',
    dropdownSortOrder: 5,
    defaultOpen: true
}

const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

const homeBaseBot = getBot(byTag("studioCatalog", true), byTag('respawnPoint', true));

const homeButton = {
    ...menuOptions,
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

//STUDIO CHOICE
const studioGroup = {
    ...menuOptions,
    label: 'choose a studio',
    dropdownSortOrder: 1,
    dropdownOptions: []
}

let studioData = await os.listUserStudios();

if (studioData.success) {
    const studios = studioData.studios;
    for (let i = 0; i < studios.length; ++i) {

        //add to menu
        studioGroup.dropdownOptions.push( {
            ...menuOptions,
            label: studios[i].displayName,
            studioData: studios[i],
            onClick: `@
                links.place.setStudio(tags.studioData);
                shout('clearHomePlaceMenu');
            `
        })
        
    }

    //add to menu
    studioGroup.dropdownOptions.push( {
        ...menuOptions,
        label: 'user',
        studioData: {
            studioId: authBot?.id,
            displayName: 'user'
        },
        onClick: `@
            links.place.setStudio(tags.studioData);
            shout('clearHomePlaceMenu');
        `
    })   
}

const shareButton = {
    ...menuOptions,
    label: 'share',
    formAddress: 'ios_share',
    onClick: `@
        shout('clearHomePlaceMenu');
        links.place.onStoreMenu();
    `
};

if (tags.studioId) {
    ab.links.menu.abCreateMenuDropdown(moveToPlaceButton);
    ab.links.menu.abCreateMenuButton(shareButton);
} else {
    ab.links.menu.abCreateMenuDropdown(studioGroup);
}