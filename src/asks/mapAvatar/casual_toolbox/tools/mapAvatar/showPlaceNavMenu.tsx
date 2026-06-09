superShout("abNavigationMenuRefresh");
superShout("showSuperNav");
// const dropdownOptions = [];

// const currentDim = ab.links.remember.tags.abActiveDimension;
// const currentPortal = configBot.tags.mapPortal ? "map" : configBot.tags.gridPortal == "blueprint" ? "blueprint" :"grid";
// const activeMenu = configBot.tags.menuPortal;

// const menuOptions = {};

// menuOptions.dimension = activeMenu;
// menuOptions[activeMenu] = true;
// menuOptions.clearMapAvatarMenu = "@ destroy(thisBot);";
// menuOptions.abMenuRefresh = "@ destroy(thisBot);";
// menuOptions.avatar = getLink(thisBot);

// const placeNav = {
//     ...menuOptions,
//     label: 'places',
//     dropdownSortOrder: 1,
//     [activeMenu + "SortOrder"]: 1
// }

// if (currentPortal == 'map') {

//     const homeBaseBot = getBot("respawnPoint", true);

//     if (homeBaseBot) {
//         const homeButton = {
//             ...menuOptions,
//             label: 'home',
//             formAddress: 'https://auth-aux-dev-filesbucket-682397690660.s3.amazonaws.com/318c04f1-1391-4c10-8d43-aaebc5170265/cd38affc0604beaa588da21aa1be750bb3e73b3b3cae23eb30307c34494459f3.png',
//             onClick: `@
//                 const homeBot = getBot("respawnPoint", true);
//                 if (homeBot) {
//                     links.avatar.links.homeworld?.toggleGPS(false);
//                     const dimension = homeBot.tags.dimension ?? 'home';
//                     links.avatar.onPlaceClicked({
//                         dimension: dimension,
//                         x: homeBot.tags[dimension + 'X'],
//                         y: homeBot.tags[dimension + 'Y']
//                     })
//                     os.focusOn(homeBot, { zoom: 2000 }).catch(() => {});
//                 }
//                 shout("abMenuRefresh");
//             `
//         };

//         dropdownOptions.push(homeButton);
//     }

//     const placesArr = [];
//     const places = getBots("homePlace", true);
//     for (const hPlace of places) {
//         if (hPlace.tags.homeBase == true) {
//             continue;
//         }
//         if (hPlace.tags.placeLabel == that) {
//             continue;
//         }
//         const placeObj = {
//             ...menuOptions,
//             label: hPlace.tags.placeLabel,
//             formAddress: hPlace.tags.placeLabelIcon ?? 'location_on',
//             place: getLink(hPlace),
//             onClick: `@
//                 if (links.place) {
//                     links.avatar.links.homeworld?.toggleGPS(false);
//                     os.focusOn(links.place, { zoom: 2000 }).catch(e => {});
//                     const dimension = links.place.tags.dimension ?? 'home';
//                     links.avatar.onPlaceClicked({
//                         dimension: dimension,
//                         x: links.place.tags[dimension + 'X'],
//                         y: links.place.tags[dimension + 'Y']
//                     })
//                     shout("clearMapAvatarMenu");
//                 }
//                 `
//         }

//         placesArr.push(placeObj);
//     }

//     placesArr.sort((a, b) => {
//         const nameA = a.label.toUpperCase();
//         const nameB = b.label.toUpperCase();

//         if (nameA < nameB) {
//             return -1;
//         }
//         if (nameA > nameB) {
//             return 1;
//         }
//         return 0;
//     });

//     for (const sortedPlace of placesArr) {
//         dropdownOptions.push(sortedPlace);
//     }

//     const currentLocationButton = {
//         ...menuOptions,
//         label: 'current location',
//         formAddress: 'near_me',
//         onClick: `@
//             const location = await os.getGeolocation();
//             if (!location.success) {
//                 os.toast("Could not access current location.");
//                 return;
//             }
//             const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? 'home';
//             links.avatar.onPlaceClicked({
//                 dimension: dimension,
//                 x: location.longitude,
//                 y: location.latitude
//             })
//             links.avatar.links.navigation.goToCurrentLocation();
//             shout("abMenuRefresh");
//         `
//     }

//     dropdownOptions.push(currentLocationButton);
// }

// placeNav.dropdownOptions = dropdownOptions;

// ab.links.menu.abCreateMenuDropdown(placeNav);