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
const username = await ab.links.console.getUserName({ canSetPreferredName: false });

if (links.homeworld) {
    const homeworldButtons = {
        ...menuOptions,
        label: `${username}'s world layer`,
        abMenuSortOrder: -3,
        menuItemType: 'dropdown',
        dropdownSortOrder: -3,
        dropdownOptions: [
            {
                ...menuOptions,
                formAddress: 'pin_drop',
                label: `set default location`,
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
                label: `save world layer`,
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
                label: `factory reset world layer`,
                homeworld: tags.homeworld,
                onClick: ListenerString(async () => {
                    links.homeworld.factoryResetHomeworld();
                    shout('abMenuRefresh');
                }),
            }
        ]}

        ab.links.menu.abCreateMenuDropdown(homeworldButtons);
}

if (links.layers) {
    const dropdownOptions = await links.layers.getLayerMenu({menuPortal: "abMenu"});
    const layersButtons = {
        ...menuOptions,
        label: `world layers`,
        abMenuSortOrder: -2,
        menuItemType: 'dropdown',
        dropdownSortOrder: -2,
        dropdownOptions: dropdownOptions
    }

    ab.links.menu.abCreateMenuDropdown(layersButtons);
}