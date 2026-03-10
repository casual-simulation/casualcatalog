const toolboxData = that.toolboxData;
const toolboxTitle = toolboxData.title;
const toolboxName = toolboxData.name;
const toolboxStudio = toolboxData.studio;
const gridData = that.gridData;

//LOADING BAR?

if (!links.shellUtils) {
    // Need abShell to use it's abLog function.
    links.learn.abAdapt('abShell');
}

if (toolboxStudio == false) {
    await links.learn.abAdapt(toolboxName);
    links.shellUtils.abLog(`${toolboxTitle ?? toolboxName} loaded`);
}
else {
    const toolboxLookup = await links.search.hatch({ abID: toolboxName, recordKey: toolboxStudio, autoHatch: true });

    if (toolboxLookup.success) {
        links.shellUtils.abLog(`${toolboxTitle ?? toolboxName} loaded`);
    }
    else {
        links.shellUtils.abLog({ message: `issue loading ${toolboxTitle ?? toolboxName}, please try again`, logType: 'error' });
    }
}

const activeToolbox = getBot("system", `ab.toolbox.${toolboxTitle ?? toolboxName}`);

if (activeToolbox && activeToolbox.tags.abGridMenuOnBeforeCreate) {
    links.remember.masks.abGridFocus = gridData;
    await ab.links.menu.abOpenMenu("grid");
    const menuBot = getBot("baseSkill", getLink(activeToolbox));
    if (menuBot) {
        menuBot.onPointerUp();
        menuBot.onClick();
    }
}
else if (activeToolbox && activeToolbox.tags.abGridMenuAction) {
    activeToolbox.abGridMenuAction({ gridInformation: gridData });
}
else if (activeToolbox && activeToolbox.tags.abCoreMenuAction) {
    //REFRESH AND THEN OPEN???
}