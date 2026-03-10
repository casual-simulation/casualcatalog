//make sure the user is logged in
await os.requestAuthBotInBackground();

if (!authBot) {
    return;
}

shout("clearChannelCreatorMenu");
configBot.tags.menuPortal = "channelCreatorMenu";

const channelIDMenuItem = {
    label: "channelID: ",
    onClick: `@
        const newChannelID = await os.showInput(null, {
            title: "channelID"
        });
        if (newChannelID) {
            links.channelCreator.tags.channelID = newChannelID;
            tags.label = "channelID: " + newChannelID;
        }
    `,
    channelCreator: await getLink(thisBot),
    channelCreatorMenu: true,
    clearChannelCreatorMenu: `@destroy(this);`
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
            links.channelCreator.tags.biosSetting = newBIOS.value;
            tags.label = "BIOS: " + newBIOS.value;
        }
    `,
    channelCreator: await getLink(thisBot),
    channelCreatorMenu: true,
    clearChannelCreatorMenu: `@destroy(this);`
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
        links.channelCreator.tags.sideloadSetting = newSideload.value;
        tags.label = "sideload: " + newSideload.value;
        
    `,
    channelCreator: await getLink(thisBot),
    channelCreatorMenu: true,
    clearChannelCreatorMenu: `@destroy(this);`
}

const instMenuItem = {
    label: "inst: ",
    onClick: `@
        const newInst = await os.showInput(null, {
            title: 'inst',
        });

        if (newInst) {
           links.channelCreator.tags.instSetting = newInst;
            tags.label = "inst: " + newInst; 
        }
    `,
    channelCreator: await getLink(thisBot),
    channelCreatorMenu: true,
    clearChannelCreatorMenu: `@destroy(this);`
}

const patternMenuItem = {
    label: "pattern: ",
    onClick: `@
        const newPattern = await os.showInput(null, {
            title: 'pattern',
        });

        if (newPattern) {
            links.channelCreator.tags.patternSetting = newPattern;
            tags.label = "pattern: " + newPattern; 
        }
    `,
    channelCreator: await getLink(thisBot),
    channelCreatorMenu: true,
    clearChannelCreatorMenu: `@destroy(this);`
}

const studioMenuItem = {
    label: "studio: ",
    onClick: `@
        const newStudio = await os.showInput(null, {
            title: 'studio',
        });

        if (newStudio) {
            links.channelCreator.tags.studioSetting = newStudio;
            tags.label = "studio: " + newStudio; 
        }
    `,
    channelCreator: getLink(thisBot),
    channelCreatorMenu: true,
    clearChannelCreatorMenu: `@destroy(this);`
}

const createMenuItem = {
    label: "create channel",
    onClick: `@
        links.channelCreator.createChannel();
    `,
    channelCreator: getLink(thisBot),
    channelCreatorMenu: true,
    clearChannelCreatorMenu: `@destroy(this);`
}

await links.menu.abCreateMenuButton(channelIDMenuItem);
await links.menu.abCreateMenuButton(biosMenuItem);
await links.menu.abCreateMenuButton(sideLoadMenuItem);
await links.menu.abCreateMenuButton(instMenuItem);
await links.menu.abCreateMenuButton(patternMenuItem);
await links.menu.abCreateMenuButton(studioMenuItem);
await links.menu.abCreateMenuButton(createMenuItem);