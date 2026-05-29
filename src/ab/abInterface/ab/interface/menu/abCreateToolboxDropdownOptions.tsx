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
if (toolbox) {
    menuOptions.toolbox = getLink(toolbox);
}
menuOptions.gridInformation = gridInformation;
menuOptions.search = tags.search;
menuOptions.artifact = tags.artifact;
//menuOptions.formAddress = "hardware";

if (toolboxTools.length === 0) {
    const message = toolboxName + " does not have any tools listed in the tool_array tag";

    ab.log({ name: abPersonality.tags.abBuilderIdentity, avatar: abPersonality.tags.abBuilderAvatar, message, space: "tempLocal" });
    os.toast(message, 5);
    console.error(message);
}

for (let tool of toolboxTools) {
    const toolButton = {
        ...menuOptions,
        tool,
        label: tool.name,
        targetAB: tool.targetAB,
        isArtifact: tool.artifact || false,
        onClick: ListenerString(() => {
            let toolboxBot = tags.toolbox;
            if (!toolboxBot) {
                const foundToolbox = getBot(byTag("tool_array", arr => Array.isArray(arr) && arr.find(t => t.targetAB == tags.targetAB)));
                toolboxBot = foundToolbox ? getLink(foundToolbox) : null;
            }

            if (tags.isArtifact) {
                const abArtifactShard = {
                    data: {
                        eggParameters: {
                            toolboxBot,
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
            } else {
                links.search.onLookupAskID({
                    askID: tags.targetAB,
                    sourceEvent: 'tool',
                    eggParameters: {
                        toolboxBot,
                        gridInformation: tags.gridInformation
                    },
                });
            }

            shout('abMenuRefresh');
            if (links.toolbox) {
                whisper(links.toolbox, 'onToolboxDropdownOptionClick', { toolbox: links.toolbox, tool: tags.tool });
            }

            if (ab.links.toolbox) {
                ab.links.toolbox.pushRecentTool({ tool: tags.tool });
            }
        })
    };

    if (tool.formAddress) {
        toolButton.formAddress = tool.formAddress;
    }

    dropdownOptions.push(toolButton);
}

return dropdownOptions;