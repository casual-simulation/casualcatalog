//make sure the user is logged in
await os.requestAuthBotInBackground();

if (!authBot) {
    return;
}

shout("clearChannelEditorMenu");
configBot.tags.menuPortal = "channelEditorMenu";

//Find installed channel
const launcherBot = getBot("system", system => system?.includes("channels.launchers."));

if (!launcherBot) {
    os.toast("no active channel");
    return;
}
const saveChannelConfig = {
    label: "save channel configuration",
    onClick: `@
        links.channelEditor.saveChannelConfig();
    `,
    channelEditor: getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

await links.menu.abCreateMenuButton(saveChannelConfig);

const newConfigMenuItem = {
    label: "add new context",
    onClick: `@
        const newContextName = await os.showInput(null, {title: "context"});
        links.channelEditor.generateConfig(${newContextName});
    `,
    channelEditor: getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

await links.menu.abCreateMenuButton(newConfigMenuItem);

const contextMap = {...launcherBot.tags.contextMap};
for (const context of contextMap) {
    const contextMenuItem = {
        label: "edit context: " + context,
        onClick: `@
            links.channelEditor.generateConfig(${context});
        `,
        channelEditor: await getLink(thisBot),
        channelEditorMenu: true,
        clearChannelEditorMenu: `@destroy(this);`
    }
    await links.menu.abCreateMenuButton(contextMenuItem);
}