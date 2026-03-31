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

if (tags.studioId == authBot?.id) {
    //reconstitute homeworld
    menuGroup.menuItems.push({
        formAddress: 'refresh',
        label: 'refresh homeworld',
        onClick: `@links.place.updateHomeWorld(); shout('abMenuRefresh');`
    });

    //homeworld version history
    menuGroup.menuItems.push({
        formAddress: 'history',
        label: 'homeworld version history',
        onClick: `@links.place.showHomeVersionHistory(); shout('abMenuRefresh');`
    });
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
menuGroup.menuItems.push({
    formAddress: 'publish',
    label: 'publish changes',
    onClick: `@links.place.publishStudio(); shout('abMenuRefresh');`
});


if (tags.studioId == authBot?.id) {
    //factory reset homeworld
    menuGroup.menuItems.push({
        formAddress: 'delete_forever',
        color: 'red',
        labelColor: 'black',
        label: 'factory reset homeworld',
        onClick: `@links.place.factoryResetHomeWorld(); shout('abMenuRefresh');`
    });
} else {
    //remove from homeworld
    menuGroup.menuItems.push({
        formAddress: 'delete_forever',
        color: 'red',
        labelColor: 'black',
        label: 'unpin from homeworld',
        onClick: `@links.place.removeFromHomeworld(); shout('abMenuRefresh');`
    });
}

ab.links.menu.abCreateMenuGroup(menuGroup);
