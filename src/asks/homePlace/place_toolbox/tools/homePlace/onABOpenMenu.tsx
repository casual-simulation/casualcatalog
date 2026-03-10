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
        {
            formAddress: 'refresh',
            label: 'reconstitute homeworld',
            onClick: `@links.place.updateHomeWorld(); shout('clearHomePlaceMenu');`
        },
        {
            formAddress: 'save',
            label: 'backup homeworld',
            onClick: `@links.place.backupHomeworld(); shout('clearHomePlaceMenu');`
        },
        {
            formAddress: 'history',
            label: 'homeworld version history',
            onClick: `@links.place.showHomeVersionHistory(); shout('clearHomePlaceMenu');`
        },
        {
            formAddress: 'delete_forever',
            color: 'red',
            labelColor: 'black',
            label: 'factory reset homeworld',
            onClick: `@links.place.factoryResetHomeWorld(); shout('clearHomePlaceMenu');`
        }
    ]
}

//If not home base
if (tags.homeBase == true) {
    ab.links.menu.abCreateMenuGroup(menuGroup);
}