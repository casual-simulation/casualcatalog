if (tags.ownerID != authBot?.id) {
    return;
}

if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    avatar: getLink(thisBot)
}

if (links.homeworld) {
    const username = await ab.links.console.getUserName({ canSetPreferredName: false });
    const homeworldButtons = {
        ...menuOptions,
        label: `world layer actions`,
        abMenuSortOrder: -3,
        menuItemType: 'dropdown',
        dropdownSortOrder: -3,
        dropdownOptions: [
            {
                ...menuOptions,
                formAddress: 'pin_drop',
                label: `set respawn point`,
                homeworld: tags.homeworld,
                onClick: ListenerString(async () => {
                    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal;
                    links.homeworld.setRespawnPoint({x: links.avatar.tags[dimension + 'X'], y: links.avatar.tags[dimension + 'Y']});
                    shout('abMenuRefresh');
                }),
            },
            {
                ...menuOptions,
                formAddress: 'save',
                label: `save ${username ? username + "'s " : ""}world layer`,
                homeworld: tags.homeworld,
                onClick: ListenerString(async () => {
                    links.homeworld.saveHomeworld();
                    shout('abMenuRefresh');
                }),
            },
            // {
            //     ...menuOptions,
            //     formAddress: 'history',
            //     label: 'homeworld version history',
            //     homeworld: tags.homeworld,
            //     onClick: ListenerString(async () => {
            //         links.homeworld.showHomeVersionHistory();
            //         shout('abMenuRefresh');
            //     }),
            // },
            {
                ...menuOptions,
                formAddress: 'delete_forever',
                color: 'red',
                labelColor: 'black',
                label: `factory reset ${username ? username + "'s " : ""}world layer`,
                homeworld: tags.homeworld,
                onClick: ListenerString(async () => {
                    links.homeworld.factoryResetHomeworld();
                    shout('abMenuRefresh');
                }),
            }
        ]}

        ab.links.menu.abCreateMenuDropdown(homeworldButtons);
}