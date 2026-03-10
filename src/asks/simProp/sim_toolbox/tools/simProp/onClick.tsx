shout('abMenuRefresh');
shout("clearSimPropMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

const triggerBot = getBot("choosingProp", true);

if (triggerBot) {
    triggerBot.addTrigger(thisBot);
    tags.color = tags.prevColor;
    tags.prevColor = null;
    return;
}

configBot.tags.menuPortal = 'simProp_menu';

const menuOptions = {
    simProp_menu: true,
    clearSimPropMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    prop: getLink(thisBot)
}

const propButton = {
    ...menuOptions,
    label: 'set prop name: ' + (tags.roleName ?? ""),
    simProp_menuSortOrder: 1,
    onClick: `@
        const response = await os.showInput(links.prop.tags.roleName, {
            autoSelect: true,
            title: 'set this prop name'
        });
        links.prop.tags.roleName = response;
        links.prop.tags.label = response;
        links.prop.onClick();
    `
}

const imageButton = {
    ...menuOptions,
    label: 'visual description',
    formAddress: 'edit',
    simProp_menuSortOrder: 7,
    onCreate: `@
        masks.menuItemText = links.prop.tags.imagePrompt ?? '';
    `,
    onSubmit: `@
        links.prop.tags.imagePrompt = that.text;
    `
}

const addAttributeButton = {
    ...menuOptions,
    label: 'add new stat',
    simProp_menuSortOrder: 2,
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

        if (!links.prop.tags.simAttributes) {
            links.prop.tags.simAttributes = {};
        }

        const tempAttributes = {...links.prop.tags.simAttributes};
        tempAttributes[response] = response2;

        links.prop.tags.simAttributes = tempAttributes;
        links.prop.onClick();
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
    groupSortOrder: 2,
    simProp_menuSortOrder: 2,
    menuItems: [addAttributeButton]
}

if (tags.simAttributes && Object.keys(tags.simAttributes).length != 0) {
    attributesGroup.menuItems.push(seeAttributesButton);
}

const trackAttributeButton = {
    ...menuOptions,
    label: 'tracked stat: ' + (tags.trackedStat ?? ""),
    simProp_menuSortOrder: 4,
    onClick: `@
        const response = await os.showInput(links.prop.tags.trackedStat, {
            autoSelect: true,
            title: 'what stat would you like to track?'
        });
        links.prop.tags.trackedStat = response;
        links.prop.onClick();
    `
}

const trackAttributeStartButton = {
    ...menuOptions,
    label: 'tracked stat starting value: ' + (tags.trackedStatStartingValue ?? ""),
    simProp_menuSortOrder: 5,
    onClick: `@
        const response = await os.showInput(links.prop.tags.trackedStatStartingValue ?? 0, {
            autoSelect: true,
            title: 'choose a starting value for the tracked stat'
        });
        links.prop.tags.trackedStatStartingValue = response;
        links.prop.onClick();
    `
}

const trackAttributeEndButton = {
    ...menuOptions,
    label: 'tracked stat ending value: ' + (tags.trackedStatEndingValue ?? ""),
    simProp_menuSortOrder: 6,
    onClick: `@
        const response = await os.showInput(links.prop.tags.trackedStatEndingValue ?? 0, {
            autoSelect: true,
            title: 'choose an ending value for the tracked stat'
        });
        links.prop.tags.trackedStatEndingValue = response;
        links.prop.onClick();
    `
}

const lockPropButton = {
    ...menuOptions,
    label: 'lock prop',
    simProp_menuSortOrder: 8,
    onClick: `@
        const response = await os.showConfirm({
            title: 'Lock this prop?',
            content: 'you will not be able to edit this prop anymore'
        });
        if (response) {
            links.prop.tags.propLocked = true;
            links.prop.tags.simAttributesStartingValues = links.prop.tags.simAttributes;
            links.prop.setProgressBar();
            links.prop.createImage();
        }
        links.prop.onClick();
    `
}


if (!tags.propLocked) {
    ab.links.menu.abCreateMenuButton(propButton);  

    ab.links.menu.abCreateMenuGroup(attributesGroup);

    ab.links.menu.abCreateMenuButton(trackAttributeButton);   
    ab.links.menu.abCreateMenuButton(trackAttributeStartButton);   
    ab.links.menu.abCreateMenuButton(trackAttributeEndButton);   
    ab.links.menu.abCreateMenuButton(lockPropButton);
    ab.links.menu.abCreateMenuInput(imageButton);   
} else {
    // shout("clearActionMenu");

    // if (configBot.tags.menuPortal != "action_menu") {
    //     configBot.tags.menuPortal = "action_menu";
    // }

    thisBot.showStats();
    const avatarBot = getBot(byTag("simAvatar", true), byTag("remoteID", getID(configBot)));
    if (avatarBot) {
        const xPos = (avatarBot.tags[tags.dimension + 'X'] && avatarBot.tags[tags.dimension + 'X'] > tags[tags.dimension + 'X']) ? tags[tags.dimension + 'X'] + 3 : tags[tags.dimension + 'X'] - 3;
        const yPos = (avatarBot.tags[tags.dimension + 'Y'] && avatarBot.tags[tags.dimension + 'Y'] > tags[tags.dimension + 'Y']) ? tags[tags.dimension + 'Y'] + 3 : tags[tags.dimension + 'Y'] - 3;
        avatarBot.onGridClick({
            position: {
                x: xPos,
                y: yPos
            },
            dimension: tags.dimension
        })
    }

    // const actionBots = getBots(byTag("simAction", true), byTag("startingAction", true));

    // for (let i = 0; i < actionBots.length; ++i) {
    //     if (actionBots[i].tags.roleTags && actionBots[i].tags.roleTags.length != 0) {
    //         if(actionBots[i].tags.roleTags.includes(tags.roleName)) {
    //             actionBots[i].showAction();
    //         }
    //     }
    // }
}
