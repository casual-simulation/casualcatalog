if (ab.links.personality.tags.abCatalogName) {
    setTagMask(thisBot, "abGridMenuLabel", ab.links.personality.tags.abCatalogName);
}


//NEW
const dropdownOptions = [];

const possibleToolboxes = links.remember.tags.toolbox_array;

for (let i = 0; i < possibleToolboxes.length; i++)
{
    const menuBot = {};

    menuBot.abMenu = true;
    menuBot.abMenuRefresh = "@ destroy(thisBot);";
    menuBot.gridData = links.remember.tags.abGridFocus;
    menuBot.manager = getLink(thisBot);
    menuBot.formAddress = "add_box";
    menuBot.manifestation = tags.manifestation;
    menuBot.onClick = `@ 
        links.manager.toolbox_add({toolboxData: tags.toolbox_data, gridData: tags.gridData}); 
        setTagMask(ab.links.remember, "lastOpenedDropdown", null);
        shout("abMenuRefresh");`;
    
    const activeToolbox = possibleToolboxes[i];
    const extantBot = activeToolbox.studio ? getBot("abIDOrigin", activeToolbox.name): getBot(activeToolbox.name, true);

    menuBot.toolbox_data = activeToolbox;
    menuBot.label = activeToolbox.title ?? activeToolbox.name;

    if (!extantBot)
    {
        dropdownOptions.push(menuBot);
    }
}

masks.dropdownOptions = dropdownOptions;

return;