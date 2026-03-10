shout("abToolboxReset");

configBot.masks.menuPortal = "abToolboxMenu";

const toolboxTools = tags.tool_array;
const gridInformation = abRemember.tags.abGridFocus;
const menuBots = [];
const toolBotButton = {};

toolBotButton.space = "tempLocal";
toolBotButton.menuItemStyle = {"border-radius":"8px", "margin-top":"3px"};
toolBotButton.abToolboxReset = "@ destroy(thisBot);";
toolBotButton.labelAlignment = "left";
toolBotButton.abToolboxMenu = true;
toolBotButton.learn = tags.learn;
toolBotButton.color = links.remember.tags.abBaseStrokeColor;
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
toolBotButton.onClick = `@ if(tags.targetStudio != false)
{
    shout("hatch", {abID: tags.targetAB, recordKey: tags.targetStudio, autoHatch: true, eggParameters: tags.gridInformation});
}
else
{
    links.learn.abAdapt({systemID: tags.targetAB, data: tags.gridInformation});
}`;
console.log(toolBotButton.gridInformation)
for (let i = 0; i < toolboxTools.length; i++)
{
    const currentTool = toolboxTools[i];

    toolBotButton.label = currentTool.name;
    toolBotButton.targetAB = currentTool.targetAB;
    toolBotButton.targetStudio = currentTool.studio;

    const newButton = create(toolBotButton);

    menuBots.push(newButton);
}

masks.onGridClick = `@ thisBot.abToolboxReset();`;
masks.menuBots = getLink(menuBots);