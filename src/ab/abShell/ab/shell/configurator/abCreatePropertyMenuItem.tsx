interface ABCreatePropertyMenuItemArg { 
    abConfiguratorGroup: string;
    menuGroup: string;
    property: ABConfiguratorProperty;
    index: number;
}

const { abConfiguratorGroup, menuGroup, property, index } = that as ABCreatePropertyMenuItemArg ?? {};

if (!property) {
    console.warn(`[${tags.system}.${tagName}] given null for a property.`);
    return null;
}

const BASE_TAGS = {
    space: 'tempLocal',
    [menuGroup ? `abConfiguratorMenu_${menuGroup}` : 'abConfiguratorMenu']: true,
    menuGroup,
    abConfiguratorGroup,
    manager: getLink(thisBot),
    name: `abConfiguratorMenuItem.${property.key}`,
    property: '🧬' + JSON.stringify(property),
    tooltip: property.description ?? property.label,
    updatePropertyField: ListenerString(() => {
        /** This is a utility function for easily settings/changing values in the property tag object that is CasualOS tag friendly. */
        const { name, value, suppressRefresh = false } = that;

        if (suppressRefresh) {
            thisBot.vars.suppressRefresh = true;
        }

        const property = tags.property;
        property[name] = value;
        tags.property = '🧬' + JSON.stringify(property);
    }),
    onBotAdded: ListenerString(() => {
        if (links.manager.tags.debug) {
            console.log(`[${tags.name}] invoke`);
        }

        os.addBotListener(thisBot, 'onClick', () => {
            thisBot.hideTooltip();
        })

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
    onPointerEnter: ListenerString(() => {
        thisBot.hideTooltip();

        if (tags.tooltip) {
            thisBot.vars.timeoutId = setTimeout(async () => {
                thisBot.vars.tooltipId = await os.tip(tags.tooltip, undefined, undefined, Infinity);
            }, links.manager.tags.tooltipTimeoutMS)
        }
    }),
    onPointerExit: ListenerString(() => {
        thisBot.hideTooltip();
    }),
    hideTooltip: ListenerString(() => {
        if (thisBot.vars.timeoutId) {
            clearTimeout(thisBot.vars.timeoutId);
            thisBot.vars.timeoutId = null;
        }

        if (thisBot.vars.tooltipId) {
            os.hideTips(thisBot.vars.tooltipId);
            thisBot.vars.tooltipId = null;
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
            thisBot.updatePropertyField({ name: 'value', value: !tags.property.value })
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
        formAddress: 'palette',
        onClick: ListenerString(async () => {
            const property = tags.property as ABConfiguratorPropertyColor;
            const current = property.value ?? property.default;
            const picked = await os.showInput(current, {
                type: 'color',
                title: property.label ?? property.key,
            });
            if (picked != null) {
                thisBot.updatePropertyField({ name: 'value', value: picked });
            }
        }),
        onRefreshDisplay: ListenerString(async () => {
            const property = tags.property as ABConfiguratorPropertyColor;
            tags.label = `${property.label ?? property.key}: ${property.value ?? property.default ?? 'unset'}`;
            tags.color = property.value ?? property.default;
            tags.labelColor = await ab.links.utils.getContrastColor(tags.color);
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

            thisBot.updatePropertyField({ name: 'value', value: text, suppressRefresh: true });
        })
    })
} else if (property.type === 'group') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        formAddress: 'folder',
        onClick: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyGroup;
            configBot.tags.menuPortal = `abConfiguratorMenu_${property.key}`;
        }),
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyGroup;
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