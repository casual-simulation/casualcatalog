shout('abMenuRefresh');
shout("clearLauncherMenu");

configBot.tags.menuPortal = 'launcher_menu';

const menuOptions = {
    launcher_menu: true,
    clearLauncherMenu: `@destroy(thisBot);`,
    launcher: getLink(thisBot)
}

const newMenuItemButton = {
    ...menuOptions,
    formAddress: 'add',
    label: 'new menu item',
    launcher_menuSortOrder: 1,
    onClick: `@
        links.launcher.clearNewOptions();
        links.launcher.showNewMenuItemMenu()`
}

const removeMenuItemButton = {
    ...menuOptions,
    label: 'remove menu item',
    dropdownSortOrder: 2,
    dropdownOptions: []
}

if (thisBot.vars.uuabMenuData) {
    for(let i = 0; i < thisBot.vars.uuabMenuData.length; ++i) {
        if (thisBot.vars.uuabMenuData[i].groupID) {
            for(let j = 0; j < thisBot.vars.uuabMenuData[i].menuItems.length; ++j) {
                const tempItem = {
                    ...menuOptions,
                    label: thisBot.vars.uuabMenuData[i].menuItems[j].label,
                    onClick: `@
                        links.launcher.removeMenuItem({index: ${i}, groupIndex: ${j}});
                        links.launcher.showLauncherMenu();
                    `
                }

                removeMenuItemButton.dropdownOptions.push(tempItem);
            }
        } else {
            const tempItem2 = {
                ...menuOptions,
                label: thisBot.vars.uuabMenuData[i].label,
                onClick: `@
                    links.launcher.removeMenuItem({index: ${i}});
                    links.launcher.showLauncherMenu();
                `
            }
            removeMenuItemButton.dropdownOptions.push(tempItem2);
        }
    }
}

const lockButton = {
    ...menuOptions,
    formAddress: 'lock',
    label: 'lock uuab',
    launcher_menuSortOrder: 3,
    onClick: `@
        links.launcher.lockUUAB();
        links.launcher.showUUABMenu();
    `
}

const saveButton = {
    ...menuOptions,
    formAddress: 'save',
    label: 'submit',
    launcher_menuSortOrder: 4,
    onClick: `@
        links.launcher.submitUUAB();
    `
}

const testButton = {
    ...menuOptions,
    formAddress: 'science',
    label: 'test menu',
    launcher_menuSortOrder: 5,
    onClick: `@
        links.launcher.showTestMenu();
    `
}

if (thisBot.vars.uuabMenuData && thisBot.vars.uuabMenuData.length != 0) {
    ab.links.menu.abCreateMenuDropdown(removeMenuItemButton);
}
ab.links.menu.abCreateMenuButton(newMenuItemButton);
ab.links.menu.abCreateMenuButton(lockButton);
ab.links.menu.abCreateMenuButton(saveButton);
ab.links.menu.abCreateMenuButton(testButton);