if (!that) {
    return;
}

//make sure the user is logged in
await os.requestAuthBotInBackground();

if (!authBot) {
    return;
}

const launcherBot = getBot("system", system => system.includes("channels.launchers."));
const contextMap = {...launcherBot.tags.contextMap};
const contextInfo = {...contextMap[that]};

if (!contextInfo) {
    contextInfo = {
        "studio": null,
        "pattern": null,
        "bios": "free",
        "inst": null,
        "sideload": false
    }
}

shout("clearChannelEditorMenu");
configBot.tags.menuPortal = "channelEditorMenu";

vars.configMenuData = contextInfo;

const contextMenuItem = {
    label: "context: " + context,
    channelEditor: await getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

const biosMenuItem = {
    label: "BIOS: ",
    onClick: `@
        const newBIOS = await os.showInput(null, {
            title: 'BIOS',
            type: 'list',
            placeholder: 'bios',
            items: [
                {
                    label: 'Free',
                    value: 'free'
                },
                {
                    label: 'Local',
                    value: 'local'
                },
                {
                    label: 'Studio',
                    value: 'studio'
                }
            ]
        });
        if (newBIOS) {
            links.channelEditor.vars.configMenuData["bios"] = newBIOS.value;
            tags.label = "BIOS: " + newBIOS.value;
        }
    `,
    channelEditor: await getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

const sideLoadMenuItem = {
    label: "sideload: ",
    onClick: `@
        const newSideload = await os.showInput(false, {
            title: 'sideload',
            type: 'list',
            placeholder: 'inst',
            items: [
                {
                    label: 'true',
                    value: true
                },
                {
                    label: 'false',
                    value: false
                }
            ]
        });
        links.channelEditor.vars.configMenuData["sideload"] = newSideload.value;
        tags.label = "sideload: " + newSideload.value;
        
    `,
    channelEditor: await getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

const instMenuItem = {
    label: "inst: " + vars.configMenuData["inst"],
    onClick: `@
        const newInst = await os.showInput(null, {
            title: 'inst',
        });

        if (newInst) {
           links.channelEditor.vars.configMenuData["inst"] = newInst;
            tags.label = "inst: " + newInst; 
        }
    `,
    channelEditor: await getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

const patternMenuItem = {
    label: "pattern: " + vars.configMenuData["pattern"],
    onClick: `@
        const newPattern = await os.showInput(null, {
            title: 'pattern',
        });

        if (newPattern) {
            links.channelEditor.vars.configMenuData["pattern"] = newPattern;
            tags.label = "pattern: " + newPattern; 
        }
    `,
    channelEditor: await getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

const studioMenuItem = {
    label: "studio: " + vars.configMenuData["studio"],
    onClick: `@
        const newStudio = await os.showInput(null, {
            title: 'studio',
        });

        if (newStudio) {
            links.channelEditor.vars.configMenuData["studio"] = newStudio;
            tags.label = "studio: " + newStudio; 
        }
    `,
    channelEditor: getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

const saveMenuItem = {
    label: "save context configuration",
    onClick: `@
        links.channelEditor.saveContext({'context': ${context}, 'data': ${vars.configMenuData}});
        shout("clearChannelEditorMenu");
    `,
    channelEditor: getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

const removeMenuItem = {
    label: "delete context",
    onClick: `@
        links.channelEditor.deleteContext(${context});
        shout("clearChannelEditorMenu");
    `,
    channelEditor: getLink(thisBot),
    channelEditorMenu: true,
    clearChannelEditorMenu: `@destroy(this);`
}

await links.menu.abCreateMenuButton(contextMenuItem);
await links.menu.abCreateMenuButton(biosMenuItem);
await links.menu.abCreateMenuButton(sideLoadMenuItem);
await links.menu.abCreateMenuButton(instMenuItem);
await links.menu.abCreateMenuButton(patternMenuItem);
await links.menu.abCreateMenuButton(studioMenuItem);
await links.menu.abCreateMenuButton(saveMenuItem);
await links.menu.abCreateMenuButton(removeMenuItem);