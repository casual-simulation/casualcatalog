interface ABOpenConfiguratorArg {
    abConfiguratorGroup: string;
    abConfiguratorTitle?: string;
    bots?: Bot[];
}

const { abConfiguratorGroup, abConfiguratorTitle, bots: incomingBots } = that as ABOpenConfiguratorArg ?? {};

assert(abConfiguratorGroup, `[${tags.system}.${tagName}] abConfiguratorGroup is a required parameter.`);

const bots = incomingBots ?? getBots((b) => {
    return b.tags.abConfiguratorGroup === abConfiguratorGroup;
});

const configuratorData: ABConfiguratorData = await thisBot.abCollectConfiguratorData({ abConfiguratorGroup, bots });

if (tags.debug) {
    console.log(`[${tags.system}.${tagName}] collected configurator data:`, configuratorData);
}

const dataFound = configuratorData && configuratorData.group && configuratorData.properties && configuratorData.properties.length > 0;

if (dataFound) {
    thisBot.abCloseConfigurator(); // Close any currently open configurator menu.

    // Keep a the configurator data that is used to created this menu cached for reference.
    // Good for remembering the structure of the data, but not the values themselves as the current values should be
    // retrieved from the menu items.
    thisBot.vars.cachedConfiguratorData = configuratorData;

    // Navigation stack used by group/list/scalar sub-menus and the unified back button.
    thisBot.vars.menuStack = [];

    const menuGroups: ABConfiguratorPropertyGroup[] = thisBot.abGetGroupsFromProperties({ properties: configuratorData.properties });

    configBot.masks.menuPortal = 'abConfiguratorMenu';

    const configTitle = ab.links.menu.abCreateMenuText({
        space: 'tempLocal',
        name: 'abConfiguratorTitle',
        abConfiguratorMenu: true,
        abConfiguratorMenuSortOrder: Number.MIN_SAFE_INTEGER,
        abConfiguratorMenuReset: ListenerString(() => {
            destroy(thisBot);
        }),
        label: abConfiguratorTitle ?? `configure:\n${abConfiguratorGroup}`,
        labelAlignment: 'center',
        menuItemStyle: {
        },
        menuItemLabelStyle: {
            'font-weight': 'bold',
        }
    })
    
    const menuItemBots = [];
    const listMenuItemBots: Bot[] = [];

    // Put creation logic into function to allow for recursive calling.
    function createPropertyMenuItems(properties: ABConfiguratorProperty[], menuGroup: string) {
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            const menuItemBot = thisBot.abCreatePropertyMenuItem({ abConfiguratorGroup, property, menuGroup, index: i });

            menuItemBots.push(menuItemBot);

            if (property.type === 'group') {
                createPropertyMenuItems(property.properties, property.key);
            } else if (property.type === 'list') {
                listMenuItemBots.push(menuItemBot);
            }
        }
    }

    createPropertyMenuItems(configuratorData.properties);

    // Create list sub-menu chrome (title + add button) for each list and pre-create entry bots.
    for (const listMenuBot of listMenuItemBots) {
        const listProperty = listMenuBot.tags.property as ABConfiguratorPropertyList;
        const listKey = listProperty.key;
        const listPortal = `abConfiguratorMenu_${listKey}`;

        ab.links.menu.abCreateMenuText({
            space: 'tempLocal',
            name: `abConfiguratorListTitle.${listKey}`,
            [listPortal]: true,
            [`${listPortal}SortOrder`]: Number.MIN_SAFE_INTEGER,
            formAddress: 'list',
            abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot); }),
            label: listProperty.label ?? listKey,
            labelAlignment: 'center',
            menuItemStyle: {},
            menuItemLabelStyle: { 'font-weight': 'bold' },
        });

        ab.links.menu.abCreateMenuButton({
            space: 'tempLocal',
            name: `abConfiguratorListAdd.${listKey}`,
            [listPortal]: true,
            [`${listPortal}SortOrder`]: Number.MAX_SAFE_INTEGER - 2,
            listOwnerKey: listKey,
            listOwnerBot: getLink(listMenuBot),
            abConfiguratorMenuReset: ListenerString(() => { destroy(thisBot); }),
            formAddress: 'add',
            label: 'add entry',
            color: '#cce5ff',
            onClick: ListenerString(() => {
                links.listOwnerBot.abAddListEntry();
            }),
        });
    }

    const defaultsButton = ab.links.menu.abCreateMenuButton({
        space: 'tempLocal',
        name: 'abConfiguratorMenuDefaults',
        abConfiguratorMenu: true,
        abConfiguratorMenuSortOrder: Number.MAX_SAFE_INTEGER - 1,
        abConfiguratorMenuReset: ListenerString(() => {
            destroy(thisBot);
        }),
        manager: getLink(thisBot),
        menuItemBots: getLink(menuItemBots),
        abConfiguratorGroup,
        formAddress: 'restart_alt',
        label: 'defaults',
        onClick: ListenerString(() => {
            const menuItemBots = Array.isArray(links.menuItemBots) ? links.menuItemBots : [links.menuItemBots];
            for (const menuItemBot of menuItemBots) {
                if (menuItemBot.tags.bubbleUpTarget) {
                    continue;
                }
                const property = menuItemBot.tags.property as ABConfiguratorProperty;
                if (property) {
                    property.value = undefined;
                    menuItemBot.tags.property = '🧬' + JSON.stringify(property);
                    if (property.type === 'list') {
                        whisper(menuItemBot, 'abRebuildListEntries');
                    }
                }
            }
        }),
        menuItemStyle: {},
        menuItemLabelStyle: {},
    })

    const submitButton = ab.links.menu.abCreateMenuButton({
        space: 'tempLocal',
        name: 'abConfiguratorMenuSubmit',
        abConfiguratorMenu: true,
        abConfiguratorMenuSortOrder: Number.MAX_SAFE_INTEGER,
        abConfiguratorMenuReset: ListenerString(() => {
            destroy(thisBot);
        }),
        manager: getLink(thisBot),
        menuItemBots: getLink(menuItemBots),
        abConfiguratorGroup,
        formAddress: 'check',
        label: `done`,
        color: '#A4DD00',
        labelColor: 'black',
        shadowColor: 'black',
        onClick: ListenerString(() => {
            // Create a configurator data object and collect all the menu item property tags.
            const properties: ABConfiguratorProperty[] = [];
            const menuItemBots = Array.isArray(links.menuItemBots) ? links.menuItemBots : [links.menuItemBots];

            for (const menuItemBot of menuItemBots) {
                if (menuItemBot.tags.bubbleUpTarget) {
                    continue;
                }
                const property = menuItemBot.tags.property as ABConfiguratorProperty;

                if (property && property.type !== 'group') {
                    properties.push(property);
                }
            }
            
            if (links.manager.tags.debug) {
                console.log(`[${tags.name}] submit properties:`, properties);
            }

            links.manager.abApplyConfiguratorProperties({ abConfiguratorGroup: tags.abConfiguratorGroup, properties });
            links.manager.abCloseConfigurator();
        }),
        menuItemStyle: {
        },
        menuItemLabelStyle: {
            // 'font-weight': 'bold',
        }
    })

    const groupBackButton = ab.links.menu.abCreateMenuButton({
        space: 'tempLocal',
        name: 'abConfiguratorMenuSubmit',
        abConfiguratorMenuReset: ListenerString(() => {
            destroy(thisBot);
        }),
        manager: getLink(thisBot),
        menuItemBots: getLink(menuItemBots),
        abConfiguratorGroup,
        formAddress: 'arrow_back',
        label: `back`,
        onClick: ListenerString(() => {
            const stack = links.manager.vars.menuStack ?? [];
            const prev = stack.pop();
            links.manager.vars.menuStack = stack;
            configBot.masks.menuPortal = prev ?? 'abConfiguratorMenu';
        }),
    });

    for (const menuGroup of menuGroups) {
        // Create menu title for each group name.
        const groupTitle = ab.links.menu.abCreateMenuText({
            space: 'tempLocal',
            name: `abConfiguratorGroupTitle.${menuGroup.key}`,
            menuGroupKey: menuGroup.key,
            formAddress: 'folder',
            [`abConfiguratorMenu_${menuGroup.key}`]: true,
            [`abConfiguratorMenu_${menuGroup.key}SortOrder`]: Number.MIN_SAFE_INTEGER,
            abConfiguratorMenuReset: ListenerString(() => {
                destroy(thisBot);
            }),
            label: `${menuGroup.label ?? menuGroup.key}`,
            labelAlignment: 'center',
            menuItemStyle: {
            },
            menuItemLabelStyle: {
                'font-weight': 'bold',
            }
        })

        // Put the group back button in each menu group.
        groupBackButton.tags[`abConfiguratorMenu_${menuGroup.key}`] = true;
        groupBackButton.tags[`abConfiguratorMenu_${menuGroup.key}SortOrder`] = Number.MAX_SAFE_INTEGER;
    }

    // Put the back button in each list's sub-menu and remember the link so list-entry
    // sub-menus (created dynamically) can share the same back button instance.
    for (const listMenuBot of listMenuItemBots) {
        const listKey = listMenuBot.tags.property.key;
        groupBackButton.tags[`abConfiguratorMenu_${listKey}`] = true;
        groupBackButton.tags[`abConfiguratorMenu_${listKey}SortOrder`] = Number.MAX_SAFE_INTEGER;
        listMenuBot.tags.backButton = getLink(groupBackButton);
    }

    // With the back button bound to each list, build the initial entry rows.
    // (Done after binding so complex-entry sub-dimensions can pick up the back button.)
    for (const listMenuBot of listMenuItemBots) {
        whisper(listMenuBot, 'abRebuildListEntries');
    }

    shout('onABConfiguratorMenuOpened', { abConfiguratorGroup, menuItemBots });
} else {
    ab.links.utils.abLog({ message: `Can't open ab configurator for '${abConfiguratorGroup}' — no data was found.`})
}