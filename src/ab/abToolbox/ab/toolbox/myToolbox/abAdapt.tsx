if (configBot.tags.toolbox)
{
    links.ask.abCoreMenuAction({message: configBot.tags.toolbox});
}

const blankBox = getBot("system", "myToolbox.tool.blankToolbox");

if (blankBox)
{
    blankBox.tags.color = links.remember.tags.abBaseStrokeColor;
    blankBox.tags.abGridMenuColor = links.remember.tags.abBaseStrokeColor;
}