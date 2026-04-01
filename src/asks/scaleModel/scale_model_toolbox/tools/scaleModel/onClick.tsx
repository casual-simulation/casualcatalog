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

//NAME
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

//ATTRIBUTES
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

//STATES
const addStateButton = {
    ...menuOptions,
    label: 'add new state group',
    scaleModel_menuSortOrder: 3,
    onClick: `@
        links.model.masks.tempStateName = null;
        links.model.masks.tempStateStart = null;
        links.model.newStateGroupMenu();
    `
}

const seeStatesButton = {
    ...menuOptions,
    label: 'states',
    menuItemType: 'dropdown'
}

seeStatesButton.dropdownOptions = [];
for (const item in tags.modelStates) {
    const tempDropdownItem = {
        ...menuOptions,
        label: `${item}: ${tags.modelStates[item].start}`
    }
    seeStatesButton.dropdownOptions.push(tempDropdownItem);
}

const statesGroup = {
    groupSortOrder: 3,
    scaleModel_menuSortOrder: 3,
    menuItems: [addStateButton]
}

if (tags.modelStates && Object.keys(tags.modelStates).length != 0) {
    statesGroup.menuItems.push(seeStatesButton);
}

//LISTENER
const addListenerButton = {
    ...menuOptions,
    label: 'add new listener',
    scaleModel_menuSortOrder: 4,
    onClick: `@
        links.model.masks.tempListenerGroupName = null;
        links.model.masks.tempListenerStateName = null;
        links.model.masks.tempListenerType = null;
        links.model.masks.tempListenerStatName = null;
        links.model.masks.tempListenerName = null;
        links.model.newListenerMenu();
    `
}

const seeListenersButton = {
    ...menuOptions,
    label: 'listeners',
    menuItemType: 'dropdown'
}

seeListenersButton.dropdownOptions = [];
for (const item in tags.modelListeners) {
    const tempDropdownItem = {
        ...menuOptions,
        label: `${item}`
    }
    seeListenersButton.dropdownOptions.push(tempDropdownItem);
}

const listenersGroup = {
    groupSortOrder: 4,
    scaleModel_menuSortOrder: 4,
    menuItems: [addListenerButton]
}

if (tags.modelListeners && Object.keys(tags.modelListeners).length != 0) {
    listenersGroup.menuItems.push(seeListenersButton);
}

//LOCK
const lockModelButton = {
    ...menuOptions,
    label: 'lock model',
    scaleModel_menuSortOrder: 5,
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
    ab.links.menu.abCreateMenuGroup(statesGroup); 
    ab.links.menu.abCreateMenuGroup(listenersGroup);     
    ab.links.menu.abCreateMenuButton(lockModelButton);
} else {
    thisBot.showStats();
}
