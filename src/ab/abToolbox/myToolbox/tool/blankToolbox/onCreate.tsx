if (!tags.system)
{
    tags.system = "ab.toolbox.blankToolbox";
}

const possibleToolBots = getBots("system");
const toolboxName = tags.system.substring(11);

let toolBot = true;

for (let i = 0; i < possibleToolBots.length; i++)
{
    const currentPossible = possibleToolBots[i];
    const possibleSystemTag = currentPossible.tags.system;
    const toolPrefix = toolboxName + ".tool.";

    if (possibleSystemTag.indexOf(toolPrefix) != -1)
    {
        toolBot = false;
    }
}

if (toolBot)
{
    const exampleToolBot = {};

    exampleToolBot.onClick = "@ os.toast('hello world')";
    exampleToolBot.color = "gold";
    exampleToolBot.system = toolboxName + ".tool.blankExample";

    create(exampleToolBot);
}

tags.abGridMenuAction = tags.activeMenuTag;