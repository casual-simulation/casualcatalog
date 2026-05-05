const gridInformation = {dimension: that?.dimension, position: { x: that?.x, y: that?.y}} ?? abRemember.tags.abGridFocus;
const toolboxes = [...tags.toolbox_array] ?? [];

// Strip out toolboxes that are alreacy loaded for this studio.
for (let i = toolboxes.length - 1; i >= 0; i--) {
    const existingToolboxBot = getBot((b) => {
        return b.tags.abArtifactName === 'kit' && 
               b.tags.studioId === tags.studioId &&
               b.tags.label === toolboxes[i].title && 
               b.tags.lineTo === thisBot.id
    });

    if (existingToolboxBot) {
        toolboxes.splice(i, 1);
    }
}


await os.sleep(0);

const BASE_MENU_TAGS = {
    dimension: 'studioCatalog_toolMenu',
    studioCatalog_toolMenu: true,
    abMenuRefresh: '@destroy(thisBot)',
    clearStudioStationToolMenu: `@destroy(thisBot)`,
    toolbox: getLink(thisBot),
    gridInformation: gridInformation,
    search: tags.search,
    artifact: tags.artifact,
}

shout('clearStudioStationToolMenu');
configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'studioCatalog_toolMenu';

if (toolboxes.length > 0) {
    const toolboxesGroup = {
        ...BASE_MENU_TAGS,
        studioCatalog_toolMenuSortOrder: 2,
        groupSortOrder: 2,
        menuItems: []
    }

    for (let toolbox of toolboxes) {
        const toolboxButton = {
            ...BASE_MENU_TAGS,
            label: toolbox.title,
            toolboxTitle: toolbox.title,
            studioId: tags.studioId,
            formAddress: 'home_repair_service',
            targetAB: toolbox.name,
            onClick: ListenerString(async () => {
                await ab.links.search.onLookupAskID({
                    askID: tags.targetAB,
                    eggParameters: {
                        studioId: tags.studioId,
                        toolbox_name: tags.toolboxTitle,
                        gridInformation: {
                            ...tags.gridInformation
                        }
                    }
                })

                shout('abMenuRefresh');
            })
        };

        if (toolbox.formAddress) {
            toolButton.formAddress = toolbox.formAddress;
        }

        toolboxesGroup.menuItems.push(toolboxButton);
    }

    ab.links.menu.abCreateMenuGroup(toolboxesGroup);
} else {
    ab.links.menu.abCreateMenuText({
        ...BASE_MENU_TAGS,
        label: `all kits have been loaded from ${tags.label}`
    })
}