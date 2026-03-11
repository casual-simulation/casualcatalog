interface ABCreatePropertyMenuItemArgs { 
    abConfiguratorGroup: string;
    menuGroup: string;
    property: ABConfiguratorProperty;
    index: number;
}

const { abConfiguratorGroup, menuGroup, property, index } = that as ABCreatePropertyMenuItemArgs ?? {};

if (!property) {
    console.warn(`[${tags.system}.${tagName}] given null for a property.`);
    return null;
}

const BASE_TAGS = {
    space: 'tempLocal',
    [menuGroup ? `abConfiguratorMenu_${menuGroup}` : 'abConfiguratorMenu']: true,
    abConfiguratorGroup,
    manager: getLink(thisBot),
    name: `abConfiguratorMenuItem.${property.key}`,
    property: '🧬' + JSON.stringify(property),
    upatePropertyField: ListenerString(() => {
        /** This is a utility function for easily settings/changing values in the property tag object that is CasualOS tag friendly. */
        const { name, value, suppressRefresh = false } = that;

        if (suppressRefresh) {
            thisBot.vars.suppressRefresh = true;
        }

        const property = tags.property;
        if (name in property) {
            property[name] = value;
        }

        tags.property = '🧬' + JSON.stringify(property);
    }),
    onBotAdded: ListenerString(() => {
        if (links.manager.tags.debug) {
            console.log(`[${tags.name}] invoke`);
        }

        whisper(thisBot, 'onRefreshDisplay');
    }),
    onBotChanged: ListenerString(() => {
        if (that.tags.includes('property')) {
            if (thisBot.vars.suppressRefresh) {
                thisBot.vars.suppressRefresh = false;
                return;
            }

            if (links.manager.tags.debug) {
                console.log(`[${tags.name}] onRefreshDisplay`);
            }

            whisper(thisBot, 'onRefreshDisplay');
        }
    }),
    abConfiguratorMenuReset: ListenerString(() => {
        destroy(thisBot);
    }),
}

let menuItem = null;

if (property.type === 'boolean') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        onClick: ListenerString(() => {
            thisBot.upatePropertyField({ name: 'value', value: !tags.property.value })
        }),
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyBoolean;
            
            tags.formAddress = property.value === true ? 'check_box' : 'check_box_outline_blank';
            tags.label = property.label ?? property.key;
        }),
    })
} else if (property.type === 'color') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyColor;
        }),
    })
} else if (property.type === 'select') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertySelect;
        }),
    })
} else if (property.type === 'multiselect') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyMultiSelect;
        }),
    })
} else if (property.type === 'number') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyNumber;
        }),
    })
} else if (property.type === 'text') {
    menuItem = ab.links.menu.abCreateMenuInput({
        ...BASE_TAGS,
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyText;

            tags.label = property.placeholder ?? property.label ?? property.key;
            tags.menuItemText = property.value;
        }),
        onInputTyping: ListenerString(() => {
            const { text } = that;

            thisBot.upatePropertyField({ name: 'value', value: text, suppressRefresh: true });
        })
    })
} else if (property.type === 'group') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        onClick: ListenerString(() => {

        }),
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyGroup;

            tags.formAddress = 'folder';
            tags.label = property.label ?? property.key;
        }),
    })
}  else {
    console.error(`[${tags.system}.${tagName}] configurator property type ${property.type} is not implemented.`);
}

if (menuItem) {
    return menuItem;
} else {
    return null;
}