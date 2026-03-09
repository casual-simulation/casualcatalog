const toolboxArray = abRemember.tags.toolbox_array;

let allToolsLoaded = true;

for (let i = 0; i < toolboxArray.length; i++) {
    const currentTool = toolboxArray[i].name;

    if (!getBot("abIDOrigin", currentTool) && !getBot(currentTool, true)) {
        allToolsLoaded = false;
        break;
    }
}

if (allToolsLoaded) {
    destroy(thisBot);
}