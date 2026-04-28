const gridInformation = {dimension: that?.dimension, position: { x: that?.x, y: that?.y}} ?? abRemember.tags.abGridFocus;
const toolboxes = [...tags.toolbox_array] ?? [];

await os.sleep(0);

const menuOptions = {};

shout("clearStudioStationToolMenu");
configBot.masks.menuPortal = null;
configBot.tags.menuPortal = 'studioCatalog_toolMenu';

menuOptions.dimension = 'studioCatalog_toolMenu';
menuOptions['studioCatalog_toolMenu'] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.clearStudioStationToolMenu = `@destroy(thisBot);`;
menuOptions.toolbox = getLink(thisBot);
menuOptions.gridInformation = gridInformation;
menuOptions.search = tags.search;
menuOptions.artifact = tags.artifact;

const toolboxesGroup = {
    ...menuOptions,
    studioCatalog_toolMenuSortOrder: 2,
    groupSortOrder: 2,
    menuItems: []
}

for (let toolbox of toolboxes) {
    const toolboxButton = {
        ...menuOptions,
        label: toolbox.title,
        toolboxTitle: toolbox.title,
        studioStationID: tags.studioId,
        formAddress: 'home_repair_service',
        targetAB: toolbox.name,
        onClick:`@
            await ab.links.search.onLookupAskID({
            askID: tags.targetAB,
            eggParameters: {
                gridInformation: {
                    toolbox_name: tags.toolboxTitle,
                    studioID: tags.studioStationID,
                    ...tags.gridInformation
                }
            }
        })
        shout("abMenuRefresh");
        `,
    };

    if (toolbox.formAddress) {
        toolButton.formAddress = toolbox.formAddress;
    }

    toolboxesGroup.menuItems.push(toolboxButton);
}

ab.links.menu.abCreateMenuGroup(toolboxesGroup);