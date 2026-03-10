shout('abMenuRefresh');
shout("clearNewMenuItemMenu");

configBot.tags.menuPortal = 'new_menu_item_menu';

const menuOptions = {
    new_menu_item_menu: true,
    clearNewMenuItemMenu: `@destroy(thisBot);`,
    launcher: getLink(thisBot)
}

const labelButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'label: ' + (tags.chosenLabel ?? ""),
    new_menu_item_menuSortOrder: 1,
    onClick: `@
        const response = await os.showInput(links.launcher.tags.chosenLabel ?? "", {
            autoSelect: true,
            title: 'label this menu item'
        })

        links.launcher.tags.chosenLabel = response ?? null;
        links.launcher.showNewMenuItemMenu();
    `
}

const colorButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'color: ' + (tags.chosenColor ?? ""),
    new_menu_item_menuSortOrder: 2,
    onClick: `@
        const response = await os.showInput(links.launcher.tags.chosenColor ?? "", {
            type: 'color',
            autoSelect: true,
            title: 'choose a color for this menu item'
        })

        links.launcher.tags.chosenColor = response ?? null;
        links.launcher.showNewMenuItemMenu();
    `
}

const groupButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'group: ' + (tags.chosenGroup ?? ""),
    new_menu_item_menuSortOrder: 3,
    onClick: `@
        const response = await os.showInput(links.launcher.tags.chosenGroup ?? "", {
            autoSelect: true,
            title: 'group this menu item with other menu items'
        })

        links.launcher.tags.chosenGroup = response ?? null;
        links.launcher.showNewMenuItemMenu();
    `
}

const orderButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'menu order: ' + (tags.chosenOrder ?? ""),
    new_menu_item_menuSortOrder: 4,
    onClick: `@
        const response = await os.showInput(links.launcher.tags.chosenOrder ?? "", {
            autoSelect: true,
            title: 'choose the order in which this menu item will appear, higher numbers are lower down'
        })

        links.launcher.tags.chosenOrder = response ?? null;
        links.launcher.showNewMenuItemMenu();
    `
}

const onClickButton = {
    ...menuOptions,
    label: 'button type: ' + (tags.chosenOnClick ?? ""),
    dropdownSortOrder: 5,
    dropdownOptions: [
        {
            ...menuOptions,
            label: 'info',
            onClick: `@
                links.launcher.tags.chosenOnClick = 'info';
                links.launcher.showNewMenuItemMenu();
            `
        },
        {
            ...menuOptions,
            label: 'open link',
            onClick: `@
                links.launcher.tags.chosenOnClick = 'link';
                links.launcher.showNewMenuItemMenu();
            `
        },
        {
            ...menuOptions,
            label: 'open link in new tab',
            onClick: `@
                links.launcher.tags.chosenOnClick = 'external_link';
                links.launcher.showNewMenuItemMenu();
            `
        },
        {
            ...menuOptions,
            label: 'ask',
            onClick: `@
                links.launcher.tags.chosenOnClick = 'ask';
                links.launcher.showNewMenuItemMenu();
            `
        },
        {
            ...menuOptions,
            label: 'unlock',
            onClick: `@
                links.launcher.tags.chosenOnClick = 'unlock';
                links.launcher.showNewMenuItemMenu();
            `
        }
    ]
}

const createButton = {
    ...menuOptions,
    formAddress: 'add',
    label: 'create',
    new_menu_item_menuSortOrder: 7,
    onClick: `@
        if (links.launcher.tags.chosenOnClick) {
            links.launcher.addNewMenuItem();
            links.launcher.showLauncherMenu();
        } else {
            os.toast("you must provide a button type.");
        }
    `
}

ab.links.menu.abCreateMenuButton(labelButton);
ab.links.menu.abCreateMenuButton(colorButton);
ab.links.menu.abCreateMenuButton(groupButton);
ab.links.menu.abCreateMenuButton(orderButton);
ab.links.menu.abCreateMenuDropdown(onClickButton);

if (!tags.chosenOnClick) {
    createButton.menuItemStyle = {
        filter: `brightness(50%)`
    }
}

ab.links.menu.abCreateMenuButton(createButton);

//menus if chosen onClick
switch(tags.chosenOnClick) {
    case 'info':
        const infoConfigButton = {
            ...menuOptions,
            formAddress: 'edit',
            label: 'provide information',
            new_menu_item_menuSortOrder: 6,
            onClick: `@
                const response = await os.showInput(links.launcher.tags.chosenInfo ?? "", {
                    autoSelect: true,
                    title: 'provide the information that should be displayed when clicking this button'
                })

                links.launcher.tags.chosenInfo = response ?? null;
                links.launcher.showNewMenuItemMenu();
            `
        }
        ab.links.menu.abCreateMenuButton(infoConfigButton);

        break;
    case 'link':
    case 'external_link':
        const linkConfigButton = {
            ...menuOptions,
            formAddress: 'edit',
            label: 'provide link',
            new_menu_item_menuSortOrder: 6,
            onClick: `@
                const response = await os.showInput(links.launcher.tags.chosenLink ?? "", {
                    autoSelect: true,
                    title: 'provide the link that the user should be sent to when clicking this button'
                })

                links.launcher.tags.chosenLink = response ?? null;
                links.launcher.showNewMenuItemMenu();
            `
        }
        ab.links.menu.abCreateMenuButton(linkConfigButton);
        break;
    case 'ask':
        const askConfigButton = {
            ...menuOptions,
            formAddress: 'edit',
            label: 'provide ask',
            new_menu_item_menuSortOrder: 6,
            onClick: `@
                const response = await os.showInput(links.launcher.tags.chosenAsk ?? "", {
                    autoSelect: true,
                    title: 'provide ask that should be loaded when clicking this button'
                })

                links.launcher.tags.chosenAsk = response ?? null;
                links.launcher.showNewMenuItemMenu();
            `
        }
        ab.links.menu.abCreateMenuButton(askConfigButton);
        break;
    case 'unlock':
    default: 
        break;
}