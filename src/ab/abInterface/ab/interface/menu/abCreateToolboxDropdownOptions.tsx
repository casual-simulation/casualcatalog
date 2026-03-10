const toolboxTools = [...that.toolArray] ?? [];
const toolboxName = that.toolboxName ?? "Kit ";
const toolbox = that.toolbox;
const gridInformation = (that?.gridInformation && that?.gridInformation != undefined) ? that?.gridInformation : abRemember.tags.abGridFocus;

const dropdownOptions = [];
const activeMenu = that.menuPortal ?? configBot.tags.menuPortal;

const menuOptions = {};

menuOptions.dimension = activeMenu;
menuOptions[activeMenu] = true;
menuOptions.abMenuRefresh = "@ destroy(thisBot);";
menuOptions.toolbox = getLink(toolbox);
menuOptions.gridInformation = gridInformation;
menuOptions.search = tags.search;
menuOptions.artifact = tags.artifact;
//menuOptions.formAddress = "hardware";

if (toolboxTools.length === 0) {
    const message = toolboxName + " does not have any tools listed in the tool_array tag";

    ab.log(abPersonality.tags.abBuilderIdentity + ": " + message);
    os.toast(message, 5);
    console.error(message);
}

for (let tool of toolboxTools) {
    const toolButton = {
        ...menuOptions,
        label: tool.name,
        targetAB: tool.targetAB,
        isArtifact: tool.artifact || false,
        onClick:`@
            if (tags.isArtifact) {
                const abArtifactShard = {
                    data: {
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

    dropdownOptions.push(toolButton);
}

return dropdownOptions;