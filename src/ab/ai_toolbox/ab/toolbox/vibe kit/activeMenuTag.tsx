configBot.masks.menuPortal = "abToolboxMenu";

const possibleTools = getBots("system");
const toolboxName = "ai_toolbox";
const gridInformation = abRemember.tags.abGridFocus;
const menuBots = [];
const toolBotButton = {};

toolBotButton.space = "tempLocal";
toolBotButton.menuItemStyle = {"border-radius":"8px", "margin-top": "8px", "border": "2px solid #000", "box-shadow": "3px 4px #000", "min-height": "44px"};
toolBotButton.abToolboxReset = "@ destroy(thisBot);";
toolBotButton.labelAlignment = "left";
toolBotButton.abToolboxMenu = true;
toolBotButton.gridInformation = that?.gridInformation ? 
{
    [that?.gridInformation?.dimension]: true, 
    [that?.gridInformation?.dimension + "X"]: that?.gridInformation?.position.x, 
    [that?.gridInformation?.dimension + "Y"]: that?.gridInformation?.position.y, 
    listening: true, 
    system: null,
    creator: null
} :
{
    [gridInformation?.dimension]: true, 
    [gridInformation?.dimension + "X"]: gridInformation?.position.x, 
    [gridInformation?.dimension + "Y"]: gridInformation?.position.y, 
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
        toolBotButton.color = currentTool.tags.strokeColor;

        const newMenuBot = await create(toolBotButton);

        menuBots.push(newMenuBot);
    }
}

masks.onGridClick = `@ thisBot.abToolboxReset();`;
masks.menuBots = getLink(menuBots);