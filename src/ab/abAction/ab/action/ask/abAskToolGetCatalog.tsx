const catalogArr = [];
const possibleToolboxes = ab.links.remember.tags.toolbox_array ?? [];

for (let i = 0; i < possibleToolboxes.length; i++)
{
    const activeToolbox = possibleToolboxes[i];
    const extantBot = activeToolbox.studio ? getBot("abIDOrigin", activeToolbox.name): getBot(activeToolbox.name, true);

    if (!extantBot)
    {
        const displayName = activeToolbox.title ?? activeToolbox.name;
        const obj = {
            "type": "kit",
            "name": displayName,
            "id": activeToolbox.name,
            "description": activeToolbox.description ?? displayName
        }
        catalogArr.push(obj);
    }
}

const loadedToolboxes = getBots("tool_array");
for (let j = 0; j < loadedToolboxes.length; ++j) {
    const arr = loadedToolboxes[j].tags.tool_array ?? [];
    for (let k = 0; k < arr.length; ++k) {
        const toolName = arr[k].name ?? arr[k].targetAB;
        const obj = {
            "type": "tool",
            "name": toolName,
            "id": arr[k].targetAB,
            "description": arr[k].description ?? toolName,
            "agentReady": arr[k].agentReady ?? false
        }
        catalogArr.push(obj);
    }
}

return catalogArr;
