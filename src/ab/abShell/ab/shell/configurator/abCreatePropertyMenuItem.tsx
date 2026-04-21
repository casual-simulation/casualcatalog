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
        os.addBotListener(thisBot, 'onClick', () => {
            thisBot.hideTooltip();
        })

        whisper(thisBot, 'onRefreshDisplay');
    }),
    onBotChanged: ListenerString(() => {
        if (that.tags.includes('property')) {
            if (thisBot.vars.suppressRefresh) {
                thisBot.vars.suppressRefresh = false;
            }

            whisper(thisBot, 'onRefreshDisplay');
            whisper(links.menuItemBots, 'onABConfiguratorPropertyChanged', { property: tags.property });
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
    updateVisibility: ListenerString(() => {
        const property = tags.property as ABConfiguratorPropertyBase;
        const vw = property.visibleWhen;

        if (!vw) {
            return;
                }

        let siblingBot = links.siblingBot;

        if (!siblingBot) {
            // Cache reference to sibling bot.
            siblingBot = links.menuItemBots.find((b: Bot) => {
                return b.tags.name === `abConfiguratorMenuItem.${vw.key}` &&
                       b.tags.abConfiguratorGroup === tags.abConfiguratorGroup
            });
            
            if (siblingBot) {
                links.siblingBot = getLink(siblingBot);
            }
        }

        if (!siblingBot) {
            return;
        }

        const siblingProp = siblingBot.tags.property;
        const siblingValue = siblingProp?.value ?? siblingProp?.default;
        let visible = false;

        switch (vw.operator) {
            case 'equal': visible = siblingValue == vw.value; break;
            case 'not equal': visible = siblingValue != vw.value; break;
            case 'greater than': visible = siblingValue > vw.value; break;
            case 'less than': visible = siblingValue < vw.value; break;
            case 'contains': visible = Array.isArray(siblingValue) ? siblingValue.includes(vw.value) : String(siblingValue).includes(vw.value); break;
            default: {
                console.warn(`[${tags.name}.${tagName}] operator ${vw.operator} is not implemented in ${tagName}.`);
                visible = true;
            }
        }

        const menuPortalKey = tags.menuGroup ? `abConfiguratorMenu_${tags.menuGroup}` : 'abConfiguratorMenu';

        if (tags[menuPortalKey] != visible) {
            tags[menuPortalKey] = visible;
        }
    }),
    abConfiguratorMenuReset: ListenerString(() => {
        destroy(thisBot);
    }),
    onABConfiguratorMenuOpened: ListenerString(() => {
        const { abConfiguratorGroup, menuItemBots } = that;

        if (abConfiguratorGroup === tags.abConfiguratorGroup) {
            links.menuItemBots = getLink(menuItemBots);

            if (abConfiguratorGroup === tags.abConfiguratorGroup){
                thisBot.updateVisibility();
            }
        }

    }),
    onABConfiguratorPropertyChanged: ListenerString(() => {
        const myProperty = tags.property as ABConfiguratorProperty;
        const changedProperty = that.property as ABConfiguratorProperty;

        if (myProperty.key === changedProperty.key) {
            return;
        }

        if (myProperty.visibleWhen?.key === changedProperty.key) {
            thisBot.updateVisibility();
        }
    })
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
            const colorPortal = `abConfiguratorColorMenu_${property.key}`;
            const clearEvent = `clearAbConfiguratorColorMenu_${property.key}`;

            links.manager.vars.selectReturnPortal = configBot.tags.menuPortal;
            configBot.masks.menuPortal = colorPortal;

            const propertyLink = getLink(thisBot);

            ab.links.menu.abCreateMenuText({
                space: 'tempLocal',
                formAddress: 'palette',
                [colorPortal]: true,
                [`${colorPortal}SortOrder`]: Number.MIN_SAFE_INTEGER,
                clearEvent,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                label: property.label ?? property.key,
                labelAlignment: 'center',
                menuItemStyle: {},
                menuItemLabelStyle: { 'font-weight': 'bold' },
            });

            const allSwatches = ab.links.utils.tags.abDefaultColorSwatches as string[];

            const menuItems = [
                {
                    menuItemType: 'input',
                    label: 'custom color',
                    formAddress: 'palette',
                    clearEvent,
                    onCreate: ListenerString(async () => {
                        const property = links.propertyMenuBot.tags.property;
                        const current = property.value ?? property.default ?? '';
                        masks.menuItemText = current;
                        if (current) {
                            tags.color = current;
                            tags.labelColor = await ab.links.utils.getContrastColor(current);
                        }
                    }),
                    onInputTyping: ListenerString(async () => {
                        const text = that.text?.trim();
                        tags.color = text || null;
                        tags.labelColor = text ? await ab.links.utils.getContrastColor(text) : null;
                    }),
                    onSubmit: ListenerString(() => {
                        const value = that.text?.trim();
                        if (value) {
                            links.propertyMenuBot.updatePropertyField({ name: 'value', value });
                        }
                        shout(tags.clearEvent);
                        configBot.masks.menuPortal = links.propertyMenuBot.links.manager.vars.selectReturnPortal;
                    }),
                },
                {
                    menuItemType: 'dropdown',
                    label: 'swatches',
                    dropdownOptions: allSwatches.map(hex => ({
                        label: hex,
                        color: hex,
                        propertyMenuBot: propertyLink,
                        clearEvent,
                        [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                        abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                        onBotAdded: ListenerString(async () => {
                            const property = links.propertyMenuBot.tags.property;
                            const current = property.value ?? property.default;
                            tags.labelColor = await ab.links.utils.getContrastColor(tags.color);
                            if (current && tags.color.toLowerCase() === String(current).toLowerCase()) {
                                tags.label = '✓ ' + tags.color;
                            }
                        }),
                        onClick: ListenerString(() => {
                            links.propertyMenuBot.updatePropertyField({ name: 'value', value: tags.color });
                            shout(tags.clearEvent);
                            configBot.masks.menuPortal = links.propertyMenuBot.links.manager.vars.selectReturnPortal;
                        }),
                    })),
                },
            ];

            await ab.links.menu.abCreateMenuGroup({
                space: 'tempLocal',
                groupSortOrder: 1,
                [colorPortal]: true,
                propertyMenuBot: propertyLink,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                menuItems,
            });

            ab.links.menu.abCreateMenuButton({
                space: 'tempLocal',
                label: 'back',
                formAddress: 'arrow_back',
                manager: getLink(links.manager),
                [colorPortal]: true,
                clearEvent,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                [`${colorPortal}SortOrder`]: Number.MAX_SAFE_INTEGER,
                onClick: ListenerString(() => {
                    shout(tags.clearEvent);
                    configBot.masks.menuPortal = links.manager.vars.selectReturnPortal;
                }),
            });
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
            const rawCurrentValue = property.value ?? property.default;
            const currentValue = (typeof rawCurrentValue === 'object' && rawCurrentValue != null && 'value' in rawCurrentValue)
                ? (rawCurrentValue as any).value
                : rawCurrentValue;

            ab.links.menu.abCreateMenuText({
                space: 'tempLocal',
                formAddress: 'list',
                [selectPortal]: true,
                [`${selectPortal}SortOrder`]: Number.MIN_SAFE_INTEGER,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
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
                            optionLabel: o.label ?? String(o.value),
                            propertyMenuBot: propertyLink,
                            clearEvent,
                            [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                            abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                            onBotAdded: ListenerString(() => {
                                const property = links.propertyMenuBot.tags.property;
                                const raw = property.value ?? property.default;
                                const cur = (typeof raw === 'object' && raw != null && 'value' in raw) ? raw.value : raw;
                                tags.label = (tags.value === cur ? '✓ ' : '') + tags.optionLabel;
                            }),
                            onClick: ListenerString(() => {
                                links.propertyMenuBot.updatePropertyField({ name: 'value', value: tags.value });
                                shout(tags.clearEvent);
                                configBot.masks.menuPortal = links.propertyMenuBot.links.manager.vars.selectReturnPortal;
                            }),
                        })),
                    });
                } else {
                    const option = item as ABConfiguratorSelectOption;
                    menuItems.push({
                        label: `${option.value === currentValue ? '✓ ' : ''}${option.label ?? String(option.value)}`,
                        value: option.value,
                        clearEvent,
                        onClick: ListenerString(() => {
                            links.propertyMenuBot.updatePropertyField({ name: 'value', value: tags.value });
                            shout(tags.clearEvent);
                            configBot.masks.menuPortal = links.propertyMenuBot.links.manager.vars.selectReturnPortal;
                        })
                    });
                }
            }

            await ab.links.menu.abCreateMenuGroup({
                space: 'tempLocal',
                groupSortOrder: 1,
                [selectPortal]: true,
                propertyMenuBot: propertyLink,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                menuItems,
            });

            ab.links.menu.abCreateMenuButton({
                space: 'tempLocal',
                label: 'back',
                formAddress: 'arrow_back',
                manager: getLink(links.manager),
                [selectPortal]: true,
                clearEvent,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                [`${selectPortal}SortOrder`]: Number.MAX_SAFE_INTEGER,
                onClick: ListenerString(() => {
                    shout(tags.clearEvent);
                    configBot.masks.menuPortal = links.manager.vars.selectReturnPortal;
                }),
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
            const selectPortal = `abConfiguratorSelectMenu_${property.key}`;
            const clearEvent = `clearAbConfiguratorSelectMenu_${property.key}`;

            links.manager.vars.selectReturnPortal = configBot.tags.menuPortal;
            configBot.masks.menuPortal = selectPortal;

            const propertyLink = getLink(thisBot);

            const currentValues = (Array.isArray(property.value) ? property.value : (property.default ?? []))
                .map(v => (typeof v === 'object' && v != null && 'value' in v) ? (v as any).value : v);

            thisBot.vars.multiSelectValues = [...currentValues];

            ab.links.menu.abCreateMenuText({
                space: 'tempLocal',
                formAddress: 'checklist',
                [selectPortal]: true,
                [`${selectPortal}SortOrder`]: Number.MIN_SAFE_INTEGER,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                label: property.label ?? property.key,
                labelAlignment: 'center',
                menuItemStyle: {},
                menuItemLabelStyle: { 'font-weight': 'bold' },
            });

            const toggleOnClick = ListenerString(() => {
                tags.selected = !tags.selected;
                tags.label = (tags.selected ? '✓ ' : '') + tags.optionLabel;
                const vals = links.propertyMenuBot.vars.multiSelectValues ?? [];
                const idx = vals.indexOf(tags.value);
                if (tags.selected && idx === -1) vals.push(tags.value);
                else if (!tags.selected && idx !== -1) vals.splice(idx, 1);
                links.propertyMenuBot.vars.multiSelectValues = vals;
                links.propertyMenuBot.updatePropertyField({ name: 'value', value: [...vals] });
            })

            const menuItems = [];
            for (const item of property.options) {
                if ('options' in item) {
                    const group = item as ABConfiguratorSelectOptionGroup;
                    menuItems.push({
                        menuItemType: 'dropdown',
                        label: group.label ?? group.group,
                        dropdownOptions: group.options.map(o => {
                            const isSelected = currentValues.includes(o.value);
                            return {
                                label: `${isSelected ? '✓ ' : ''}${o.label ?? String(o.value)}`,
                                value: o.value,
                                optionLabel: o.label ?? String(o.value),
                                selected: isSelected,
                                selectPortal,
                                abSelectOption: true,
                                propertyMenuBot: propertyLink,
                                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                                onBotAdded: ListenerString(() => {
                                    const vals = links.propertyMenuBot.vars.multiSelectValues ?? [];
                                    tags.selected = vals.includes(tags.value);
                                    tags.label = (tags.selected ? '✓ ' : '') + tags.optionLabel;
                                }),
                                onClick: toggleOnClick,
                            };
                        }),
                    });
                } else {
                    const option = item as ABConfiguratorSelectOption;
                    const isSelected = currentValues.includes(option.value);
                    menuItems.push({
                        label: `${isSelected ? '✓ ' : ''}${option.label ?? String(option.value)}`,
                        value: option.value,
                        optionLabel: option.label ?? String(option.value),
                        selected: isSelected,
                        selectPortal,
                        abSelectOption: true,
                        propertyMenuBot: propertyLink,
                        [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                        abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                        onClick: toggleOnClick,
                    });
                }
            }

            await ab.links.menu.abCreateMenuGroup({
                space: 'tempLocal',
                groupSortOrder: 1,
                [selectPortal]: true,
                propertyMenuBot: propertyLink,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                menuItems,
            });

            ab.links.menu.abCreateMenuButton({
                space: 'tempLocal',
                label: 'back',
                formAddress: 'arrow_back',
                manager: getLink(links.manager),
                [selectPortal]: true,
                clearEvent,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                [`${selectPortal}SortOrder`]: Number.MAX_SAFE_INTEGER,
                onClick: ListenerString(() => {
                    shout(tags.clearEvent);
                    configBot.masks.menuPortal = links.manager.vars.selectReturnPortal;
                }),
            });
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
        onClick: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyNumber;
            const numberPortal = `abConfiguratorNumberMenu_${property.key}`;
            const clearEvent = `clearAbConfiguratorNumberMenu_${property.key}`;

            links.manager.vars.selectReturnPortal = configBot.tags.menuPortal;
            configBot.masks.menuPortal = numberPortal;

            const propertyLink = getLink(thisBot);

            ab.links.menu.abCreateMenuText({
                space: 'tempLocal',
                [numberPortal]: true,
                [`${numberPortal}SortOrder`]: Number.MIN_SAFE_INTEGER,
                clearEvent,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                label: property.label ?? property.key,
                labelAlignment: 'center',
                menuItemStyle: {},
                menuItemLabelStyle: { 'font-weight': 'bold' },
            });

            ab.links.menu.abCreateMenuInput({
                space: 'tempLocal',
                [numberPortal]: true,
                [`${numberPortal}SortOrder`]: 1,
                clearEvent,
                propertyMenuBot: propertyLink,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                label: property.label ?? property.key,
                formAddress: 'numbers',
                onCreate: ListenerString(() => {
                    const property = links.propertyMenuBot.tags.property;
                    const current = property.value ?? property.default;
                    masks.menuItemText = current != null ? String(current) : '';
                }),
                onSubmit: ListenerString(() => {
                    const property = links.propertyMenuBot.tags.property;
                    let parsed = Number(that.text);
                    if (isNaN(parsed)) return;
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
                    links.propertyMenuBot.updatePropertyField({ name: 'value', value: parsed });
                    shout(tags.clearEvent);
                    configBot.masks.menuPortal = links.propertyMenuBot.links.manager.vars.selectReturnPortal;
                }),
            });

            ab.links.menu.abCreateMenuButton({
                space: 'tempLocal',
                label: 'back',
                formAddress: 'arrow_back',
                manager: getLink(links.manager),
                [numberPortal]: true,
                clearEvent,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                [`${numberPortal}SortOrder`]: Number.MAX_SAFE_INTEGER,
                onClick: ListenerString(() => {
                    shout(tags.clearEvent);
                    configBot.masks.menuPortal = links.manager.vars.selectReturnPortal;
                }),
            });
        }),
    })
} else if (property.type === 'text') {
    menuItem = ab.links.menu.abCreateMenuButton({
        ...BASE_TAGS,
        formAddress: 'edit_note',
        onRefreshDisplay: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyText;
            tags.label = property.label ?? property.key;
        }),
        onClick: ListenerString(() => {
            const property = tags.property as ABConfiguratorPropertyText;
            const textPortal = `abConfiguratorTextMenu_${property.key}`;
            const clearEvent = `clearAbConfiguratorTextMenu_${property.key}`;

            links.manager.vars.selectReturnPortal = configBot.tags.menuPortal;
            configBot.masks.menuPortal = textPortal;

            const propertyLink = getLink(thisBot);

            ab.links.menu.abCreateMenuText({
                space: 'tempLocal',
                [textPortal]: true,
                [`${textPortal}SortOrder`]: Number.MIN_SAFE_INTEGER,
                clearEvent,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                label: property.label ?? property.key,
                labelAlignment: 'center',
                menuItemStyle: {},
                menuItemLabelStyle: { 'font-weight': 'bold' },
            });

            ab.links.menu.abCreateMenuInput({
                space: 'tempLocal',
                [textPortal]: true,
                [`${textPortal}SortOrder`]: 1,
                clearEvent,
                propertyMenuBot: propertyLink,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                menuItemShowSubmitWhenEmpty: true,
                label: property.placeholder ?? '',
                onCreate: ListenerString(() => {
                    const property = links.propertyMenuBot.tags.property;
                    masks.menuItemText = property.value ?? property.default ?? '';
                }),
                onSubmit: ListenerString(() => {
                    const value = that.text ?? '';
                    links.propertyMenuBot.updatePropertyField({ name: 'value', value });
                    shout(tags.clearEvent);
                    configBot.masks.menuPortal = links.propertyMenuBot.links.manager.vars.selectReturnPortal;
                }),
            });

            ab.links.menu.abCreateMenuButton({
                space: 'tempLocal',
                label: 'back',
                formAddress: 'arrow_back',
                manager: getLink(links.manager),
                [textPortal]: true,
                clearEvent,
                [clearEvent]: ListenerString(() => { destroy(thisBot) }),
                abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot) }),
                [`${textPortal}SortOrder`]: Number.MAX_SAFE_INTEGER,
                onClick: ListenerString(() => {
                    shout(tags.clearEvent);
                    configBot.masks.menuPortal = links.manager.vars.selectReturnPortal;
                }),
            });
        }),
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