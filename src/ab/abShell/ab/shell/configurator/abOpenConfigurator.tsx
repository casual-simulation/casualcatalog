interface ABOpenConfiguratorArg {
    abConfiguratorGroup: string;
    bots?: Bot[];
}

const { abConfiguratorGroup, bots: incomingBots } = that as ABOpenConfiguratorArg ?? {};

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

    const menuGroups: ABConfiguratorPropertyGroup[] = thisBot.abGetGroupsFromProperties({ properties: configuratorData.properties });

    configBot.tags.menuPortal = 'abConfiguratorMenu';

    const configTitle = ab.links.menu.abCreateMenuText({
        space: 'tempLocal',
        name: 'abConfiguratorTitle',
        abConfiguratorMenu: true,
        abConfiguratorMenuSortOrder: Number.MIN_SAFE_INTEGER,
        abConfiguratorMenuReset: ListenerString(() => {
            destroy(thisBot);
        }),
        label: `configure:\n${abConfiguratorGroup}`,
        labelAlignment: 'center',
        menuItemStyle: {
        },
        menuItemLabelStyle: {
            'font-weight': 'bold',
        }
    })
    
    const menuItemBots = [];

    // Put creation logic into function to allow for recursive calling.
    function createPropertyMenuItems(properties: ABConfiguratorProperty[], menuGroup: string) {
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            const menuItemBot = thisBot.abCreatePropertyMenuItem({ property, menuGroup, index: i });

            menuItemBots.push(menuItemBot);

            if (property.type === 'group') {
                createPropertyMenuItems(property.properties, property.key);
            }
        }
    }

    createPropertyMenuItems(configuratorData.properties);

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
            for (const menuItemBot of links.menuItemBots) {
                const property = menuItemBot.tags.property as ABConfiguratorProperty;
                if (property) {
                    property.value = undefined;
                    menuItemBot.tags.property = '🧬' + JSON.stringify(property);
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

            for (const menuItemBot of links.menuItemBots) {
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
            if (configBot.tags.menuPortal) {
                const currentGroupKey: string = configBot.tags.menuPortal.replace('abConfiguratorMenu_', '');
                const parentGroupProperty: ABConfiguratorPropertyGroup = links.manager.abGetParentGroupProperty({
                    properties: links.manager.vars.cachedConfiguratorData.properties,
                    targetKey: currentGroupKey
                })

                if (parentGroupProperty) {
                    configBot.tags.menuPortal = `abConfiguratorMenu_${parentGroupProperty.key}`;
                } else {
                    configBot.tags.menuPortal = 'abConfiguratorMenu';
                }
            }
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
} else {
    ab.links.utils.abLog({ message: `Can't open ab configurator for '${abConfiguratorGroup}' — no data was found.`})
}