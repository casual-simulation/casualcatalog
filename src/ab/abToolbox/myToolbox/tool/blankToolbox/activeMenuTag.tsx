configBot.masks.menuPortal = "abToolboxMenu";

const possibleTools = getBots("system");
const toolboxName = tags.system.substring(11);
const gridInformation = abRemember.tags.abGridFocus;
const menuBots = [];
const toolBotButton = {};

toolBotButton.space = "tempLocal";
toolBotButton.menuItemStyle = {"border-radius":"8px", "margin-top":"3px"};
toolBotButton.abToolboxReset = "@ destroy(thisBot);";
toolBotButton.labelAlignment = "left";
toolBotButton.abToolboxMenu = true;
toolBotButton.gridInformation = that?.gridInformation ?? {
    [gridInformation.dimension]: true, 
    [gridInformation.dimension + "X"]: gridInformation.position.x, 
    [gridInformation.dimension + "Y"]: gridInformation.position.y, 
    listening: true, 
    system: null,
    creator: null
};
toolBotButton.onClick = `@ create(links.baseTool, thisBot.tags.gridInformation); shout('abToolboxReset'); shout('abClick'); `;

for (let i = 0; i < possibleTools.length; i++)
{
    const currentPossible = possibleTools[i];
    const possibleSystemTag = currentPossible.tags.system;
    const toolPrefix = toolboxName + ".tool.";

    if (possibleSystemTag.indexOf(toolPrefix) != -1)
    {
        const currentTool = currentPossible;
        const toolIndex = currentTool.tags.system.indexOf(".tool.");
        const toolName = currentTool.tags.system.substring(toolIndex + 6);

        toolBotButton.label = toolName;
        toolBotButton.color = currentTool.tags.color;
        toolBotButton.baseTool = getLink(currentTool);

        const newMenuBot = await create(toolBotButton);

        menuBots.push(newMenuBot);
    }
}

masks.onGridClick = `@ thisBot.abToolboxReset();`;
masks.menuBots = getLink(menuBots);