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

    configBot.tags.menuPortal = 'abConfiguratorMenu';

    const menuTitle = ab.links.menu.abCreateMenuText({ 
        space: 'tempLocal',
        name: 'abConfiguratorMenuTitle',
        abConfiguratorMenu: true,
        abConfiguratorGroup,
        abConfiguratorMenuReset: ListenerString(() => {
            destroy(thisBot);
        }),
        // formAddress: 'build',
        label: `configure:\n${abConfiguratorGroup}`,
        labelAlignment: 'center',
        menuItemStyle: {
            // 'color': 'blue',
            // 'background-color': 'black',
            // 'filter': 'brightness(0.8)',
        },
        menuItemLabelStyle: {
            // display: 'flex',
            // color: 'red',
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

    console.log(`menuItemBots:`, menuItemBots);

    createPropertyMenuItems(configuratorData.properties);


    const submitButton = ab.links.menu.abCreateMenuButton({ 
        space: 'tempLocal',
        name: 'abConfiguratorMenuSubmit',
        abConfiguratorMenu: true,
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
            const configuratorData: ABConfiguratorData = {
                group: tags.abConfiguratorGroup,
                properties: []
            }

            for (const menuItemBot of links.menuItemBots) {
                const property = menuItemBot.tags.property as ABConfiguratorProperty;

                if (property)
                if (menuItemBot.tags.property) {
                    configuratorData.properties.push(menuItemBot.tags.property);
                }
            }
            
            if (links.manager.tags.debug) {
                console.log(`[${tags.name}] submit configurator data:`, configuratorData);
            }
        }),
        menuItemStyle: {
        },
        menuItemLabelStyle: {
            // 'font-weight': 'bold',
        }
    })
} else {
    ab.links.utils.abLog({ message: `Can't open ab configurator for '${abConfiguratorGroup}' — no data was found.`})
}