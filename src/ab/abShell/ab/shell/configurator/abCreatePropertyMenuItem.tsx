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
            thisBot.updatePropertyField({ name: 'value', value: !(tags.property.value ?? tags.property.default ?? false) })
        }),
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyBoolean;
            const current = property.value ?? property.default;
            tags.formAddress = current === true ? 'check_box' : 'check_box_outline_blank';
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
        formAddress: 'list',
        onClick: ListenerString(async () => {
            const property = tags.property as ABConfiguratorPropertySelect;
            const selectPortal = `abConfiguratorSelectMenu_${property.key}`;
            const clearEvent = `clearAbConfiguratorSelectMenu_${property.key}`;

            links.manager.vars.selectReturnPortal = configBot.tags.menuPortal;
            configBot.masks.menuPortal = selectPortal;

            const propertyLink = getLink(thisBot);
            const currentValue = property.value ?? property.default;

            ab.links.menu.abCreateMenuText({
                space: 'tempLocal',
                formAddress: 'list',
                [selectPortal]: true,
                [`${selectPortal}SortOrder`]: Number.MIN_SAFE_INTEGER,
                [clearEvent]: `@destroy(thisBot)`,
                abConfiguratorMenuReset: `@destroy(thisBot)`,
                label: property.label ?? property.key,
                labelAlignment: 'center',
                menuItemStyle: {},
                menuItemLabelStyle: {
                    'font-weight': 'bold',
                },
            });

            const menuItems = [];
            for (const item of property.options) {
                if ('options' in item) {
                    const group = item as ABConfiguratorSelectOptionGroup;
                    menuItems.push({
                        menuItemType: 'dropdown',
                        label: group.label ?? group.group,
                        dropdownOptions: group.options.map(o => ({
                            label: `${o.value === currentValue ? '✓ ' : ''}${o.label ?? String(o.value)}`,
                            value: o.value,
                            propertyMenuBot: propertyLink,
                            [clearEvent]: `@destroy(thisBot)`,
                            abConfiguratorMenuReset: `@destroy(thisBot)`,
                            onClick: `@
                                links.propertyMenuBot.updatePropertyField({ name: 'value', value: tags.value });
                                shout('${clearEvent}');
                                configBot.masks.menuPortal = links.propertyMenuBot.links.manager.vars.selectReturnPortal;
                            `,
                        })),
                    });
                } else {
                    const option = item as ABConfiguratorSelectOption;
                    menuItems.push({
                        label: `${option.value === currentValue ? '✓ ' : ''}${option.label ?? String(option.value)}`,
                        value: option.value,
                        onClick: `@
                            links.propertyMenuBot.updatePropertyField({ name: 'value', value: tags.value });
                            shout('${clearEvent}');
                            configBot.masks.menuPortal = links.propertyMenuBot.links.manager.vars.selectReturnPortal;
                        `,
                    });
                }
            }

            await ab.links.menu.abCreateMenuGroup({
                space: 'tempLocal',
                groupSortOrder: 1,
                [selectPortal]: true,
                propertyMenuBot: propertyLink,
                [clearEvent]: `@destroy(thisBot)`,
                abConfiguratorMenuReset: `@destroy(thisBot)`,
                menuItems,
            });

            ab.links.menu.abCreateMenuButton({
                space: 'tempLocal',
                label: 'back',
                formAddress: 'arrow_back',
                manager: getLink(links.manager),
                [selectPortal]: true,
                [clearEvent]: `@destroy(thisBot)`,
                abConfiguratorMenuReset: `@destroy(thisBot)`,
                [`${selectPortal}SortOrder`]: Number.MAX_SAFE_INTEGER,
                onClick: `@
                    shout('${clearEvent}');
                    configBot.masks.menuPortal = links.manager.vars.selectReturnPortal;
                `,
            });
        }),
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertySelect;
            const resolved: ABConfiguratorSelectOption | null = links.manager.abResolveSelectOption({
                options: property.options,
                value: property.value ?? property.default
            });
            tags.label = (property.label ?? property.key) + ': ' + (resolved?.label ?? resolved?.value ?? 'unset');
        }),
    })
} else if (property.type === 'multiselect') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        formAddress: 'checklist',
        onClick: ListenerString(async () => {
            const property = tags.property as ABConfiguratorPropertyMultiSelect;
            const current: any[] = Array.isArray(property.value) ? property.value : (property.default ?? []);
            const options = property.options.map((o, i) => ({ label: o.label ?? String(o.value), value: o.value }));
            const currentIndices = current
                .map(v => {
                    const normalized = (typeof v === 'object' && v != null) ? v.value : v;

                    // Try matching by value first
                    const byValue = property.options.findIndex(o => o.value === normalized);
                    if (byValue >= 0) return byValue;

                    // Fall back to index if normalized is an integer within range
                    if (typeof normalized === 'number' && Number.isInteger(normalized) && normalized >= 0 && normalized < property.options.length) {
                        return normalized;
                    }

                    return -1;
                })
                .filter(i => i >= 0);

            const selected = await os.showInput(currentIndices, {
                type: 'list',
                subtype: 'checkbox',
                title: property.label ?? property.key,
                items: options,
            });

            if (selected != null) {
                const resolved = (Array.isArray(selected) ? selected : [selected])
                    .map(s => links.manager.abResolveSelectOption({ options: property.options, value: s.value }))
                    .filter(o => o != null)
                    .map(o => o.value);

                thisBot.updatePropertyField({ name: 'value', value: resolved });
            }
        }),
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyMultiSelect;
            const current: any[] = Array.isArray(property.value) ? property.value : (property.default ?? []);
            const labels = current.map(v => {
                const opt = links.manager.abResolveSelectOption({ options: property.options, value: v });
                return opt?.label ?? opt?.value ?? String(v);
            });
            tags.label = (property.label ?? property.key) + ': ' + (labels.length > 0 ? labels.join(', ') : 'unset');
        }),
    })
} else if (property.type === 'number') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        formAddress: 'numbers',
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyNumber;
            const current = property.value ?? property.default;
            tags.label = (property.label ?? property.key) + ': ' + (current != null ? String(current) : 'unset');
        }),
        onClick: ListenerString(async () => {
            const property = tags.property as ABConfiguratorPropertyNumber;
            const current = property.value ?? property.default ?? 0;
            const input = await os.showInput(current, {
                type: 'number',
                title: property.label ?? property.key,
            });
            if (input != null) {
                let parsed = Number(input);
                if (!isNaN(parsed)) {
                    if (property.step != null) {
                        const decimals = (String(property.step).split('.')[1] ?? '').length;
                        const snap = parsed >= 0 ? Math.ceil : Math.floor;
                        parsed = parseFloat((snap(parsed / property.step) * property.step).toFixed(decimals));

                        if (property.max != null && parsed > property.max) {
                            parsed = parseFloat((Math.floor(property.max / property.step) * property.step).toFixed(decimals));
                        }

                        if (property.min != null && parsed < property.min) {
                            parsed = parseFloat((Math.ceil(property.min / property.step) * property.step).toFixed(decimals));
                        }
                    }

                    if (property.integer) {
                        parsed = Math.round(parsed);
                    }

                    if (property.max != null && parsed > property.max) {
                        parsed = property.max;
                    }

                    if (property.min != null && parsed < property.min) {
                        parsed = property.min;
                    }

                    thisBot.updatePropertyField({ name: 'value', value: parsed });
                }
            }
        })
    })
} else if (property.type === 'text') {
    menuItem = ab.links.menu.abCreateMenuInput({
        ...BASE_TAGS,
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyText;
            tags.label = property.placeholder ?? property.label ?? property.key;
            tags.menuItemText = property.value ?? property.default;
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
            configBot.masks.menuPortal = `abConfiguratorMenu_${property.key}`;
        }),
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyGroup;
            tags.label = property.label ?? property.key;
        }),
    })
} else {
    console.error(`[${tags.system}.${tagName}] configurator property type ${property.type} is not implemented.`);
}

if (menuItem) {
    return menuItem;
} else {
    return null;
}