const menuItems = [];
const activeMenu = configBot.tags.menuPortal;

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
    dimension: activeMenu,
    [activeMenu]: true,
    abMenuRefresh: '@destroy(thisBot)',
    toolbox: getLink(thisBot),
    gridInformation: gridInformation,
    search: tags.search,
    artifact: tags.artifact,
}

if (toolboxes.length > 0) {

    for (let toolbox of toolboxes) {
        const toolboxButton = {
            ...BASE_MENU_TAGS,
            label: toolbox.title,
            toolboxTitle: toolbox.title,
            studioId: configBot.tags.studio ?? authBot?.id,
            formAddress: 'home_repair_service',
            targetAB: toolbox.name,
            onClick: ListenerString(async () => {
                await links.toolbox.loadKit({
                    id: tags.targetAB,
                    gridInformation: { ...tags.gridInformation },
                });

                if (links.toolbox.links.armBot) {
                    destroy(links.toolbox.links.armBot);
                }

                shout('abMenuRefresh');
            })
        };

        if (toolbox.formAddress) {
            toolButton.formAddress = toolbox.formAddress;
        }

       menuItems.push(toolboxButton);
    }
}

masks.menuItems = menuItems;
await os.sleep(0);