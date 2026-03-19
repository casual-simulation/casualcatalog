const catalogArr = [];
const possibleToolboxes = ab.links.remember.tags.toolbox_array;

for (let i = 0; i < possibleToolboxes.length; i++)
{
    const activeToolbox = possibleToolboxes[i];
    const extantBot = activeToolbox.studio ? getBot("abIDOrigin", activeToolbox.name): getBot(activeToolbox.name, true);

    if (!extantBot)
    {
        const obj = {
            "name": activeToolbox.title,
            "id": activeToolbox.name
        }
        catalogArr.push(obj);
    }
}

const loadedToolboxes = getBots("tool_array");
for (let j = 0; j < loadedToolboxes.length; ++j) {
    const arr = loadedToolboxes[j].tags.tool_array ?? [];
    for (let k = 0; k < arr.length; ++k) {
        const obj = {
            "name": arr[k].name ?? arr[k].targetAB,
            "id": arr[k].targetAB
        }
        catalogArr.push(obj);
    }
}

return catalogArr;