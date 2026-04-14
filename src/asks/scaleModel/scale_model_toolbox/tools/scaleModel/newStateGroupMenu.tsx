shout('abMenuRefresh');
shout("clearScaleModelMenu");

await os.sleep(0);

configBot.tags.menuPortal = 'scaleModelState_menu';

const menuOptions = {
    scaleModelState_menu: true,
    clearScaleModelMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    model: getLink(thisBot)
}

//NAME
const groupNameButton = {
    ...menuOptions,
    label: 'set state group name',
    formAddress: 'edit',
    scaleModelState_menuSortOrder: 1,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempStateName;
    `,
    onInputTyping: `@
        links.model.masks.tempStateName = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempStateName = that.text;
    `
}

//START STATE
const stateStartButton = {
    ...menuOptions,
    label: 'set starting state',
    formAddress: 'edit',
    scaleModelState_menuSortOrder: 2,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempStateStart;
    `,
    onInputTyping: `@
        links.model.masks.tempStateStart = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempStateStart = that.text;
    `
}

//ADD
const addButton = {
    ...menuOptions,
    label: 'add',
    formAddress: 'add',
    scaleModelState_menuSortOrder: 6,
    onClick: `@
        const stateGroup = {};
        stateGroup.start = links.model.masks.tempStateStart;

        if (!links.model.tags.modelStates) {
            links.model.tags.modelStates = {};
        }

        const tempStates = {...links.model.tags.modelStates};
        tempStates[links.model.masks.tempStateName] = stateGroup;
        
        links.model.masks.tempStateName = null;
        links.model.masks.tempStateStart = null;

        links.model.tags.modelStates = tempStates;
        links.model.tags[links.model.masks.tempStateName] = stateGroup.start;
        links.model.onClick();
    `
}

ab.links.menu.abCreateMenuInput(groupNameButton);
ab.links.menu.abCreateMenuInput(stateStartButton);
ab.links.menu.abCreateMenuButton(addButton);