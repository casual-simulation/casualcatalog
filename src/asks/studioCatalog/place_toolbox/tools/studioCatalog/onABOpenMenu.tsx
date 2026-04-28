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

if (tags.draggable == false) {
   //move
    menuGroup.menuItems.push({
        formAddress: 'open_with',
        label: 'move studio',
        onClick: `@links.place.moveStudio(); shout('abMenuRefresh');`
    }); 
} else {
   //lock
    menuGroup.menuItems.push({
        formAddress: 'lock',
        label: 'lock studio position',
        onClick: `@links.place.lockStudio(); shout('abMenuRefresh');`
    });  
}

menuGroup.menuItems.push({
    formAddress: 'open_with',
    label: 'move studio to current location',
    onClick: `@links.place.moveStudioToLocation(); shout('abMenuRefresh');`
});

//publish
// menuGroup.menuItems.push({
//     formAddress: 'publish',
//     label: 'publish changes',
//     onClick: `@links.place.publishStudio(); shout('abMenuRefresh');`
// });

//set home
menuGroup.menuItems.push({
    formAddress: 'home',
    label: 'set as home place',
    onClick: `@shout("setHomePlace", thisBot); shout('abMenuRefresh');`
});

ab.links.menu.abCreateMenuGroup(menuGroup);
