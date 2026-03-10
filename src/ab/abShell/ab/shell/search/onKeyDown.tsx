//hidden version button for hatch menu
if (!links.ovoBot || configBot.tags.menuPortal != "abOvoMenu")
{
    return;
}

if (that.keys == "Shift")
{
    let versionButton = {};

    versionButton.abOvoMenu = true;
    versionButton.ovoSortOrder = -1;
    versionButton.maxVersion = links.ovoBot.tags.maxVersion;
    versionButton.manager = "🔗" + thisBot.id;
    versionButton.label = "change egg version";
    versionButton.labelAlignment = "center";
    versionButton.ovoMenuReset = "@ destroy(thisBot);";
    versionButton.color = links.remember.tags.abBaseAccentColor;
    versionButton.onKeyUp = "@ if(that.keys == 'Shift'){destroy(thisBot)};";
    versionButton.onClick = "@ links.manager.changeOvoVersion();";

    links.menu.abCreateMenuButton(versionButton);
}