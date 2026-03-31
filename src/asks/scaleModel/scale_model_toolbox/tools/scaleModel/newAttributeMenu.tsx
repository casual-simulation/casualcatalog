shout('abMenuRefresh');
shout("clearScaleModelMenu");

await os.sleep(0);

configBot.tags.menuPortal = 'scaleModelAttribute_menu';

const menuOptions = {
    scaleModelAttribute_menu: true,
    clearScaleModelMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    model: getLink(thisBot)
}

const attrNameButton = {
    ...menuOptions,
    label: 'set stat name',
    formAddress: 'edit',
    scaleModelAttribute_menuSortOrder: 1,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempAttributeName;
    `,
    onInputTyping: `@
        links.model.masks.tempAttributeName = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempAttributeName = that.text;
    `
}

const attrStartButton = {
    ...menuOptions,
    label: 'set starting value',
    formAddress: 'edit',
    scaleModelAttribute_menuSortOrder: 2,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempAttributeStart;
    `,
    onInputTyping: `@
        links.model.masks.tempAttributeStart = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempAttributeStart = that.text;
    `
}

const attrDeltaButton = {
    ...menuOptions,
    label: 'set stat delta',
    formAddress: 'edit',
    scaleModelAttribute_menuSortOrder: 4,
    onCreate: `@
        masks.menuItemText = links.model.masks.tempAttributeDelta;
    `,
    onInputTyping: `@
        links.model.masks.tempAttributeDelta = that.text;
    `,
    onSubmit: `@
        links.model.masks.tempAttributeDelta = that.text;
    `
}

const attrDeltaModButton = {
    ...menuOptions,
    label: 'set delta modifier',
    scaleModelAttribute_menuSortOrder: 3,
    dropdownSortOrder: 3,
    dropdownOptions: [
        {
            ...menuOptions,
            label: '+',
            onClick: `@
                links.model.masks.tempAttributeDeltaMod = tags.label;
                links.model.newAttributeMenu();
            `
        },{
            ...menuOptions,
            label: '-',
            onClick: `@
                links.model.masks.tempAttributeDeltaMod = tags.label;
                links.model.newAttributeMenu();
            `
        },{
            ...menuOptions,
            label: '/',
            onClick: `@
                links.model.masks.tempAttributeDeltaMod = tags.label;
                links.model.newAttributeMenu();
            `
        },{
            ...menuOptions,
            label: '*',
            onClick: `@
                links.model.masks.tempAttributeDeltaMod = tags.label;
                links.model.newAttributeMenu();
            `
        },
    ]
}

const attrUnitButton = {
    ...menuOptions,
    label: 'set time unit: ' + (thisBot.masks.tempAttributeTimeUnit ?? ''),
    scaleModelAttribute_menuSortOrder: 5,
    dropdownSortOrder: 5,
    dropdownOptions: [
        {
            ...menuOptions,
            label: 'hours',
            onClick: `@
                links.model.masks.tempAttributeTimeUnit = tags.label;
                links.model.newAttributeMenu();
            `
        },
        {
            ...menuOptions,
            label: 'days',
            onClick: `@
                links.model.masks.tempAttributeTimeUnit = tags.label;
                links.model.newAttributeMenu();
            `
        },
        {
            ...menuOptions,
            label: 'weeks',
            onClick: `@
                links.model.masks.tempAttributeTimeUnit = tags.label;
                links.model.newAttributeMenu();
            `
        },
        {
            ...menuOptions,
            label: 'months',
            onClick: `@
                links.model.masks.tempAttributeTimeUnit = tags.label;
                links.model.newAttributeMenu();
            `
        },
        {
            ...menuOptions,
            label: 'quarters',
            onClick: `@
                links.model.masks.tempAttributeTimeUnit = tags.label;
                links.model.newAttributeMenu();
            `
        },
        {
            ...menuOptions,
            label: 'years',
            onClick: `@
                links.model.masks.tempAttributeTimeUnit = tags.label;
                links.model.newAttributeMenu();
            `
        }
    ]
}

const addButton = {
    ...menuOptions,
    label: 'add',
    formAddress: 'add',
    scaleModelAttribute_menuSortOrder: 6,
    onClick: `@
        const attr = {};
        attr.start = links.model.masks.tempAttributeStart;
        attr.delta = links.model.masks.tempAttributeDelta;
        attr.deltaMod = links.model.masks.tempAttributeDeltaMod;
        attr.unit = links.model.masks.tempAttributeTimeUnit;

        if (!links.model.tags.modelAttributes) {
            links.model.tags.modelAttributes = {};
        }

        const tempAttributes = {...links.model.tags.modelAttributes};
        tempAttributes[links.model.masks.tempAttributeName] = attr;
        
        links.model.masks.tempAttributeName = null;
        links.model.masks.tempAttributeStart = null;
        links.model.masks.tempAttributeDelta = null;
        links.model.masks.tempAttributeDeltaMod = null;
        links.model.masks.tempAttributeTimeUnit = null;

        links.model.tags.modelAttributes = tempAttributes;
        links.model.onClick();
    `
}

ab.links.menu.abCreateMenuInput(attrNameButton);
ab.links.menu.abCreateMenuInput(attrStartButton);
ab.links.menu.abCreateMenuInput(attrDeltaButton);
ab.links.menu.abCreateMenuDropdown(attrUnitButton);
ab.links.menu.abCreateMenuDropdown(attrDeltaModButton);
ab.links.menu.abCreateMenuButton(addButton);