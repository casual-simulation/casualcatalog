const configurationData = await os.getData(that.data.studioID, that.data.patternID);

let newDeployment = false;

if (links.remember.tags.channelConfigured)
{
    return;
}

links.remember.tags.channelConfigured = true;

if (configurationData.data.bios)
{
    const targetBios = configurationData.data.bios;

    switch (targetBios) 
    {
        case "local":
            if (configBot.tags.staticInst == null)
            {
                newDeployment = true;
            }

            break;
        case "studio":
            if (configBot.tags.owner == null || configBot.tags.owner == "public")
            {
                newDeployment = true;
            }

            break;
        case "shared":
            if (configBot.tags.owner != "public")
            {
                newDeployment = true;
            }

            break;
    }
}

if (configurationData.data.egg)
{
    const targetPattern = configurationData.data.egg.pattern;
    const targetStudio = configurationData.data.egg.studio;

    shout("hatch", {abID: targetPattern, recordKey: targetStudio, autoHatch: true});
}

if (configurationData.data.gridColor)
{
    links.remember.tags.abBaseGridPortalColor = configurationData.data.gridColor;

    gridPortalBot.tags.portalColor = configurationData.data.gridColor;
}

if (configurationData.data.inst && configBot.tags.inst != configurationData.data.inst && configurationData.data.inst != null)
{
    newDeployment = true;
}

if (newDeployment)
{
    const siteOrigin = new URL(configBot.tags.url).origin;
    const targetInst = configurationData.data.inst ? "&inst=" + configurationData.data.inst : "";
    const targetBios = configurationData.data.bios ? "&bios=" + configurationData.data.bios : "";
    const targetPattern = configBot.tags.pattern ? "&pattern=" + configBot.tags.pattern : "";
    const targetURL = siteOrigin + `/?ask=${configBot.tags.ask}${targetPattern}${targetInst}${targetBios}`;

    os.goToURL(targetURL);
}