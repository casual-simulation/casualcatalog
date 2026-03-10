// const actionMenuOptions = {
//     action_menu: true,
//     clearActionMenu: `@destroy(thisBot);`,
//     clearRoleStats: `@destroy(thisBot);`
// }

// const seeAttributesButton = {
//     ...actionMenuOptions,
//     label: 'player stats',
//     defaultOpen: true,
//     dropdownSortOrder: 100,
//     action_menuSortOrder: 100
// }

// seeAttributesButton.dropdownOptions = [];
// for (const item in tags.simAttributes) {
//     const tempDropdownItem = {
//         ...actionMenuOptions,
//         label: `${item}: ${tags.simAttributes[item]}`
//     }
//     seeAttributesButton.dropdownOptions.push(tempDropdownItem);
// }

// if (tags.statsButton) {
//     destroy(links.statsButton);
// }

// const statsBots = getBots(byTag("label", "player stats"), byTag("action_menu", true));
// destroy(statsBots);

// if (tags.simAttributes && Object.keys(tags.simAttributes).length != 0) {
//     const stats = await ab.links.menu.abCreateMenuDropdown(seeAttributesButton);
//     tags.statsButton = getLink(stats);
// }