shout('abMenuRefresh');
shout("clearScaleModelMenu");

await os.sleep(0);

configBot.tags.menuPortal = 'scaleModelListener_menu';

const menuOptions = {
    scaleModelListener_menu: true,
    clearScaleModelMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    model: getLink(thisBot)
}

//TYPE
const typeDropdown = {
    ...menuOptions,
    label: 'type: ' + (masks.tempListenerType ?? ''),
    scaleModelListener_menuSortOrder: 1,
    dropdownSortOrder: 1,
    dropdownOptions: [
        {
            ...menuOptions,
            label: "state",
            onClick: `@
                links.model.masks.tempListenerType = tags.label;
                links.model.newListenerMenu();
            `
        },
        {
            ...menuOptions,
            label: "stat",
            onClick: `@
                links.model.masks.tempListenerType = tags.label;
                links.model.newListenerMenu();
            `
        },
        {
            ...menuOptions,
            label: "custom",
            onClick: `@
                links.model.masks.tempListenerType = tags.label;
                links.model.newListenerMenu();
            `
        }
    ]
}

//GROUP NAME
const groupNameButton = {
    ...menuOptions,
    label: 'set group name',
    formAddress: 'edit',
    scaleModelListener_menuSortOrder: 2,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempListenerGroupName;
    `,
    onInputTyping: `@
        links.model.masks.tempListenerGroupName = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempListenerGroupName = that.text;
    `
}

//STATE NAME
const stateNameButton = {
    ...menuOptions,
    label: 'set state name',
    formAddress: 'edit',
    scaleModelListener_menuSortOrder: 3,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempListenerStateName;
    `,
    onInputTyping: `@
        links.model.masks.tempListenerStateName = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempListenerStateName = that.text;
    `
}

//STAT NAME
const statNameButton = {
    ...menuOptions,
    label: 'set stat name',
    formAddress: 'edit',
    scaleModelListener_menuSortOrder: 2,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempListenerStatName;
    `,
    onInputTyping: `@
        links.model.masks.tempListenerStatName = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempListenerStatName = that.text;
    `
}

//LISTENER NAME
const listenerNameButton = {
    ...menuOptions,
    label: 'set listener name',
    formAddress: 'edit',
    scaleModelListener_menuSortOrder: 2,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempListenerName;
    `,
    onInputTyping: `@
        links.model.masks.tempListenerName = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempListenerName = that.text;
    `
}

//EDIT
const editButton = {
    ...menuOptions,
    label: 'edit',
    formAddress: 'edit',
    scaleModelListener_menuSortOrder: 5,
    onClick: `@
        if (links.model.masks.tempListenerType == 'state' && links.model.masks.tempListenerGroupName && links.model.masks.tempListenerStateName) {
            const tagName = links.model.masks.tempListenerGroupName + links.model.masks.tempListenerStateName + 'OnEnter';
            if (!links.model.tags[tagName]) {
                links.model.tags[tagName] = '@';
            }
            configBot.tags.tagPortal = links.model.id + '.' + tagName;
        } else if (links.model.masks.tempListenerType == 'stat' && links.model.masks.tempListenerStatName) {
            const tagName = 'on' + links.model.masks.tempListenerStatName + 'Changed';
            if (!links.model.tags[tagName]) {
                links.model.tags[tagName] = '@';
            }
            configBot.tags.tagPortal = links.model.id + '.' + tagName;
        } else if (links.model.masks.tempListenerType == 'custom' && links.model.masks.tempListenerName) {
            const tagName = links.model.masks.tempListenerName;
            if (!links.model.tags[tagName]) {
                links.model.tags[tagName] = '@';
            }
            configBot.tags.tagPortal = links.model.id + '.' + tagName;
        } else {
            os.toast("not enough listener information provided");
            return; 
        }
    `
}

//ADD
const addButton = {
    ...menuOptions,
    label: 'add',
    formAddress: 'add',
    scaleModelListener_menuSortOrder: 6,
    onClick: `@
    
        const listener = {};
        let listenerName;
        if (links.model.masks.tempListenerType == 'state' && links.model.masks.tempListenerGroupName && links.model.masks.tempListenerStateName) {
            listenerName = links.model.masks.tempListenerGroupName + links.model.masks.tempListenerStateName + 'OnEnter';
            listener.state = links.model.masks.tempListenerGroupName;
            listener.value = links.model.masks.tempListenerStateName;
        } else if (links.model.masks.tempListenerType == 'stat' && links.model.masks.tempListenerStatName) {
            listenerName = 'on' + links.model.masks.tempListenerStatName + 'Changed';
            listener.stat = links.model.masks.tempListenerStateName;
        } else if (links.model.masks.tempListenerType == 'custom' && links.model.masks.tempListenerName) {
            listenerName = links.model.masks.tempListenerName;
        }
        
        if (!listenerName) {
            os.toast("not enough listener information provided");
            return;
        }

        listener.type = links.model.masks.tempListenerType;

        if (!links.model.tags.modelListeners) {
            links.model.tags.modelListeners = {};
        }

        const tempListeners = {...links.model.tags.modelListeners};
        tempListeners[listenerName] = listener;
        
        links.model.masks.tempListenerGroupName = null;
        links.model.masks.tempListenerStateName = null;
        links.model.masks.tempListenerType = null;
        links.model.masks.tempListenerStatName = null;
        links.model.masks.tempListenerName = null;

        links.model.tags.modelListeners = tempListeners;
        links.model.onClick();
    `
}

ab.links.menu.abCreateMenuDropdown(typeDropdown);

if (masks.tempListenerType == 'custom') {
    ab.links.menu.abCreateMenuInput(listenerNameButton);
}

if (masks.tempListenerType == 'stat') {
    ab.links.menu.abCreateMenuInput(statNameButton);
}

if (masks.tempListenerType == 'state') {
    ab.links.menu.abCreateMenuInput(groupNameButton);
    ab.links.menu.abCreateMenuInput(stateNameButton);
}

ab.links.menu.abCreateMenuButton(editButton);
ab.links.menu.abCreateMenuButton(addButton);