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
        label: 'move catalog',
        onClick: `@links.place.moveStudio(); shout('abMenuRefresh');`
    }); 
} else {
   //lock
    menuGroup.menuItems.push({
        formAddress: 'lock',
        label: 'lock catalog position',
        onClick: `@links.place.lockStudio(); shout('abMenuRefresh');`
    });  
}

const inMap = configBot.tags.mapPortal ? true : false;

//publish
// menuGroup.menuItems.push({
//     formAddress: 'publish',
//     label: 'publish changes',
//     onClick: `@links.place.publishStudio(); shout('abMenuRefresh');`
// });


if (inMap) {
    
    menuGroup.menuItems.push({
        formAddress: 'open_with',
        label: 'move catalog to current location',
        onClick: `@links.place.moveStudioToLocation(); shout('abMenuRefresh');`
    });


    if (!tags.respawnPoint) {
        //set home
        menuGroup.menuItems.push({
            formAddress: 'home',
            label: 'set as home',
            onClick: `@shout("setHomePlace", thisBot); shout('abMenuRefresh');`
        }); 
    }
}

ab.links.menu.abCreateMenuGroup(menuGroup);
