const dropdownOptions = [];

const currentDim = ab.links.remember.tags.abActiveDimension;
const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
const activeMenu = configBot.tags.menuPortal;

// if (currentPortal != 'map') {
//     thisBot.masks.abCoreMenuHide = true;
// } else {
//     thisBot.masks.abCoreMenuHide = false;
// }

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abNavigationMenuRefresh = "@ destroy(thisBot);";
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.skillBot = getLink(thisBot);

const formAddressLink = await ab.abBuildCasualCatalogURL("/ab/icons/egg_planet_logo.svg");

const homeWorldButton = {
    ...menuOptions,
    label: "home world",
    formAddress: formAddressLink,
    onClick: `@
        const currentURL = new URL(configBot.tags.url);
        const origin = currentURL.origin;

        let newURL = new URL(origin);

        if (abRemember.tags.allowChannels) {
            newURL.searchParams.append("channel", false);
        }

        if (configBot.tags.comId) {
            newURL.searchParams.append("comId", configBot.tags.comId);
        }

        newURL.searchParams.append("owner", (configBot.tags.studio && configBot.tags.studio != authBot.id) ? configBot.tags.studio : "player");
        newURL.searchParams.append("inst", 'home');
        newURL.searchParams.append("mapPortal", 'home');
        newURL.searchParams.append("ask", 'home');
        
        if (configBot.tags.studio && configBot.tags.studio != authBot.id) {
           newURL.searchParams.append("studio", that.id); 
        }

        os.openURL(newURL.href);
    `
};

if (!getBot("isHomeWorldCore", true) && authBot) {
    dropdownOptions.push(homeWorldButton);
}

if (currentPortal == 'map') {

    const homeBaseBot = getBot("homeBase", true);

    if (homeBaseBot) {
        const homeButton = {
            ...menuOptions,
            label: homeBaseBot.tags.placeLabel,
            formAddress: 'https://auth-aux-dev-filesbucket-682397690660.s3.amazonaws.com/318c04f1-1391-4c10-8d43-aaebc5170265/cd38affc0604beaa588da21aa1be750bb3e73b3b3cae23eb30307c34494459f3.png',
            onClick: `@
                const homeBot = getBot("homeBase", true);
                if (homeBot) {
                    os.focusOn(homeBot, { zoom: 2000 }).catch(() => {});
                }
                shout("abMenuRefresh");
            `
        };

        dropdownOptions.push(homeButton);
    }

    const placesArr = [];
    const places = getBots("homePlace", true);
    for (const hPlace of places) {
        if (hPlace.tags.homeBase == true) {
            continue;
        }
        const placeObj = {
            ...menuOptions,
            label: hPlace.tags.placeLabel,
            formAddress: 'location_on',
            place: getLink(hPlace),
            onClick: `@
                if (links.place) {
                    os.focusOn(links.place, { zoom: 2000 }).catch(e => {});
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
        label: 'current location',
        formAddress: 'near_me',
        onClick: `@
            links.skillBot.goToCurrentLocation();
            shout("abMenuRefresh");
        `
    }

    dropdownOptions.push(currentLocationButton);
}

if (dropdownOptions.length == 0) {
    thisBot.masks.abCoreMenuHide = true;
} else {
    thisBot.masks.abCoreMenuHide = false;
}

masks.dropdownOptions = dropdownOptions;

return;