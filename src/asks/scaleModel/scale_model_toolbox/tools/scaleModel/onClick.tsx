shout('abMenuRefresh');
shout("clearScaleModelMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

configBot.tags.menuPortal = 'scaleModel_menu';

const menuOptions = {
    scaleModel_menu: true,
    clearScaleModelMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    model: getLink(thisBot)
}

const nameButton = {
    ...menuOptions,
    label: 'set model name',
    scaleModel_menuSortOrder: 1,
    onInputTyping: `@
        links.model.tags.modelName = that.text;
        links.model.tags.label = that.text;
    `,
    onCreate: `@
        masks.menuItemText = links.model.tags.modelName;
    `,
    onSubmit: `@
        links.model.tags.modelName = that.text;
        links.model.tags.label = that.text;
    `
}

const addAttributeButton = {
    ...menuOptions,
    label: 'add new stat',
    scaleModel_menuSortOrder: 2,
    onClick: `@
        links.model.masks.tempAttributeName = null;
        links.model.masks.tempAttributeStart = null;
        links.model.masks.tempAttributeDelta = null;
        links.model.masks.tempAttributeTimeUnit = null;
        links.model.masks.tempAttributeDeltaMod = null;
        links.model.newAttributeMenu();
    `
}

const seeAttributesButton = {
    ...menuOptions,
    label: 'stats',
    menuItemType: 'dropdown'
}

seeAttributesButton.dropdownOptions = [];
for (const item in tags.modelAttributes) {
    const tempDropdownItem = {
        ...menuOptions,
        label: `${item}: ${tags.modelAttributes[item].start}`
    }
    seeAttributesButton.dropdownOptions.push(tempDropdownItem);
}

const attributesGroup = {
    groupSortOrder: 2,
    scaleModel_menuSortOrder: 2,
    menuItems: [addAttributeButton]
}

if (tags.modelAttributes && Object.keys(tags.modelAttributes).length != 0) {
    attributesGroup.menuItems.push(seeAttributesButton);
}

const lockModelButton = {
    ...menuOptions,
    label: 'lock model',
    scaleModel_menuSortOrder: 3,
    formAddress: 'lock',
    onClick: `@
        const response = await os.showConfirm({
            title: 'Lock this model?',
            content: 'you will not be able to edit this model anymore'
        });
        if (response) {
            links.model.tags.modelLocked = true;
        }
        links.model.onClick();
    `
}


if (!tags.modelLocked) {
    ab.links.menu.abCreateMenuInput(nameButton);  
    ab.links.menu.abCreateMenuGroup(attributesGroup);  
    ab.links.menu.abCreateMenuButton(lockModelButton);
} else {
    thisBot.showStats();
}
