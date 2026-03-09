const gridInformation = {dimension: that?.dimension, position: { x: that?.x, y: that?.y}} ?? abRemember.tags.abGridFocus;
const toolboxTools = [...tags.tool_array] ?? [];

const menuOptions = {};

shout("clearStudioStationToolMenu");
configBot.tags.menuPortal = 'studioStation_toolMenu';

menuOptions.dimension = 'studioStation_toolMenu';
menuOptions['studioStation_toolMenu'] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.clearStudioStationToolMenu = `@destroy(thisBot);`;
menuOptions.toolbox = getLink(thisBot);
menuOptions.gridInformation = gridInformation;
menuOptions.search = tags.search;
menuOptions.artifact = tags.artifact;

for (let tool of toolboxTools) {
    const toolButton = {
        ...menuOptions,
        label: tool.name,
        targetAB: tool.targetAB,
        studioStationID: tags.studioId,
        isArtifact: tool.artifact || false,
        onClick:`@
            if (tags.isArtifact) {
                const abArtifactShard = {
                    data: {
                        studioStationID: tags.studioStationID,
                        eggParameters: {
                            toolboxBot: tags.toolbox,
                            gridInformation: tags.gridInformation
                        }
                    },
                    dependencies: [
                        {
                            askID: tags.targetAB
                        }
                    ]
                };
                links.artifact.abCreateArtifactPromiseBot({
                    abArtifactName: tags.targetAB,
                    abArtifactInstanceID: uuid(),
                    abArtifactShard,
                });
                shout("abMenuRefresh");
            } else {
                links.search.onLookupAskID({
                    askID: tags.targetAB,
                    sourceEvent: 'tool',
                    eggParameters: {
                        studioStationID: tags.studioStationID,
                        toolboxBot: tags.toolbox,
                        gridInformation: tags.gridInformation
                    },
                });
                shout("abMenuRefresh");
            }
        `,
    };

    if (tool.formAddress) {
        toolButton.formAddress = tool.formAddress;
    }

    ab.links.menu.abCreateMenuButton(toolButton);
}