shout('abMenuRefresh');
shout("clearSimRoleMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

configBot.tags.menuPortal = 'simRole_menu';

const menuOptions = {
    simRole_menu: true,
    clearSimRoleMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    role: getLink(thisBot)
}

const roleButton = {
    ...menuOptions,
    label: 'set role: ' + (tags.roleName ?? ""),
    simRole_menuSortOrder: 1,
    onClick: `@
        const response = await os.showInput(links.role.tags.roleName, {
            autoSelect: true,
            title: 'set this role'
        });
        links.role.tags.roleName = response;
        links.role.tags.label = response;
        links.role.onClick();
    `
}

const numUsersButton = {
    ...menuOptions,
    label: 'num users: ' + (tags.numUsers ?? ""),
    simRole_menuSortOrder: 2,
    onClick: `@
        const response = await os.showInput(links.role.tags.numUsers, {
            autoSelect: true,
            title: 'set the number of users allowed to occupy this role at one time'
        });
        links.role.tags.numUsers = response;
        links.role.onClick();
    `
}

const defaultPlaceButton = {
    ...menuOptions,
    label: 'default place: ' + (tags.defaultPlace ?? ""),
    simRole_menuSortOrder: 3,
    onClick: `@
        const response = await os.showInput(links.role.tags.defaultPlace, {
            autoSelect: true,
            title: 'set the place where users in this role will appear'
        });
        links.role.tags.defaultPlace = response;
        links.role.onClick();
    `
}

const addAttributeButton = {
    ...menuOptions,
    label: 'add new stat',
    simRole_menuSortOrder: 4,
    onClick: `@
        const response = await os.showInput("", {
            autoSelect: true,
            title: 'stat name'
        });

        if (!response) {
            return;
        }

        const response2 = await os.showInput("", {
            autoSelect: true,
            title: 'starting stat value'
        });

        if (!response2) {
            return;
        }

        if (!links.role.tags.simAttributes) {
            links.role.tags.simAttributes = {};
        }

        const tempAttributes = {...links.role.tags.simAttributes};
        tempAttributes[response] = response2;

        links.role.tags.simAttributes = tempAttributes;
        links.role.onClick();
    `
}

const seeAttributesButton = {
    ...menuOptions,
    label: 'stats',
    menuItemType: 'dropdown'
}

seeAttributesButton.dropdownOptions = [];
for (const item in tags.simAttributes) {
    const tempDropdownItem = {
        ...menuOptions,
        label: `${item}: ${tags.simAttributes[item]}`
    }
    seeAttributesButton.dropdownOptions.push(tempDropdownItem);
}

const attributesGroup = {
    groupSortOrder: 4,
    simRole_menuSortOrder: 4,
    menuItems: [addAttributeButton]
}

if (tags.simAttributes && Object.keys(tags.simAttributes).length != 0) {
    attributesGroup.menuItems.push(seeAttributesButton);
}

ab.links.menu.abCreateMenuButton(roleButton);  
ab.links.menu.abCreateMenuButton(numUsersButton);  
ab.links.menu.abCreateMenuButton(defaultPlaceButton);  
ab.links.menu.abCreateMenuGroup(attributesGroup);

