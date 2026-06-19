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
        label: `homeworld actions`,
        abMenuSortOrder: -3,
        menuItemType: 'dropdown',
        dropdownSortOrder: -3,
        dropdownOptions: [
            {
                ...menuOptions,
                formAddress: 'save',
                label: `save ${username ? username + "'s " : ""}layer`,
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
                label: `factory reset ${username ? username + "'s " : ""}layer`,
                homeworld: tags.homeworld,
                onClick: ListenerString(async () => {
                    links.homeworld.factoryResetHomeworld();
                    shout('abMenuRefresh');
                }),
            }
        ]}

        ab.links.menu.abCreateMenuDropdown(homeworldButtons);
}