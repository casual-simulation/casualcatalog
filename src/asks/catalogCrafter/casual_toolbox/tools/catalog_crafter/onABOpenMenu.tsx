if (links.armBot) {
    destroy(links.armBot);
}

if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    place: getLink(thisBot)
}

const menuGroup = {
    ...menuOptions,
    groupSortOrder: -1,
    abMenuSortOrder: -1,
    menuItems: [
    ]
}

// if (tags.draggable == false) {
//    //move
//     menuGroup.menuItems.push({
//         formAddress: 'open_with',
//         label: 'move catalog',
//         onClick: `@links.place.moveStudio(); shout('abMenuRefresh');`
//     }); 
// } else {
//    //lock
//     menuGroup.menuItems.push({
//         formAddress: 'lock',
//         label: 'lock catalog position',
//         onClick: `@links.place.lockStudio(); shout('abMenuRefresh');`
//     });  
// }

// ab.links.menu.abCreateMenuGroup(menuGroup);