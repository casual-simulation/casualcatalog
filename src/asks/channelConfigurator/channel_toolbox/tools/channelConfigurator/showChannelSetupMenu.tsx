shout('clearChannelSetupMenu');

configBot.masks.menuPortal = 'channelSetupMenu';

const menuTags = {
    clearChannelSetupMenu: `@destroy(thisBot);`,
    channelSetupMenu: true,
    channelConfigurator: getLink(thisBot)
}

const channelNameButton = {
    ...menuTags,
    label: "channel name: " + (tags.chosenChannelName || ''),
    onClick: `@
        const instName = await os.showInput(links.channelConfigurator.tags.chosenChannelName || "", {
            title: 'choose a name for your channel'
        });

        links.channelConfigurator.tags.chosenChannelName = instName;
        links.channelConfigurator.tags.channelSetupLabel = instName;
        links.channelConfigurator.updateBillboardLabel();
        links.channelConfigurator.showChannelSetupMenu();
    `,
    channelSetupMenuSortOrder: 1
}

ab.links.menu.abCreateMenuButton(channelNameButton);

const biosButton = {
    ...menuTags,
    label: "inst type: " + (tags.chosenBIOS || ''),
    dropdownSortOrder: 2,
    dropdownOptions: [
        {
            label: "free",
            ...menuTags,
            onClick: `@
                links.channelConfigurator.tags.chosenBIOS = "free";
                links.channelConfigurator.showChannelSetupMenu();
            `
        },
        {
            label: "studio",
            ...menuTags,
            onClick: `@
                links.channelConfigurator.tags.chosenBIOS = "studio";
                links.channelConfigurator.showChannelSetupMenu();
            `
        },
        {
            label: "local",
            ...menuTags,
            onClick: `@
                links.channelConfigurator.tags.chosenBIOS = "local";
                links.channelConfigurator.showChannelSetupMenu();
            `
        }
    ]
}

ab.links.menu.abCreateMenuDropdown(biosButton);


const instNameButton = {
    ...menuTags,
    label: "inst name: " + (tags.chosenInstName || ''),
    onClick: `@
        const instName = await os.showInput(links.channelConfigurator.tags.chosenInstName || "", {
            title: 'choose an inst name'
        });

        links.channelConfigurator.tags.chosenInstName = instName;
        links.channelConfigurator.showChannelSetupMenu();
    `,
    channelSetupMenuSortOrder: 3
}

ab.links.menu.abCreateMenuButton(instNameButton);


const patternButton = {
    ...menuTags,
    label: "pattern: " + (tags.chosenPattern || ""),
    onClick: `@
        const patternName = await os.showInput(links.channelConfigurator.tags.chosenPattern || "", {
            title: 'choose a pattern for this channel'
        });

        links.channelConfigurator.tags.chosenPattern = patternName;

        if (!links.channelConfigurator.tags.chosenPatternStudio && authBot) {
            links.channelConfigurator.tags.chosenPatternStudio = authBot.id;
        }
        links.channelConfigurator.showChannelSetupMenu();
    `,
    channelSetupMenuSortOrder: 4
}

ab.links.menu.abCreateMenuButton(patternButton);

const patternStudioButton = {
    ...menuTags,
    label: "pattern studio: " + (tags.chosenPatternStudio ? tags.chosenPatternStudio != authBot?.id ? tags.chosenPatternStudio : 'user' : ""),
    onClick: `@
        const patternName = await os.showInput(links.channelConfigurator.tags.chosenPatternStudio || "", {
            title: 'what studio is this pattern in?'
        });

        links.channelConfigurator.tags.chosenPatternStudio = patternName == 'user' ? authBot.id : patternName;
        links.channelConfigurator.showChannelSetupMenu();
    `,
    channelSetupMenuSortOrder: 5
}

ab.links.menu.abCreateMenuButton(patternStudioButton);

const editOnChannelButton = {
    ...menuTags,
    label: "edit onChannelLoaded",
    formAddress: 'edit',
    onClick: `@
        configBot.tags.tagPortal = links.channelConfigurator.id + ".channel_onChannelLoaded";
    `,
    channelSetupMenuSortOrder: 6
}

ab.links.menu.abCreateMenuButton(editOnChannelButton);

const createButton = {
    ...menuTags,
    label: "save changes",
    formAddress: 'publish',
    onClick: `@
        if (links.channelConfigurator.tags.chosenPattern && links.channelConfigurator.tags.chosenChannelName) {
            links.channelConfigurator.createChannel();
        } else {
            os.toast("You must provide a channel name and pattern");
        }
        
    `,
    channelSetupMenuSortOrder: 10,
    
}

const currentURL = new URL(configBot.tags.url);
const host = currentURL.host;
//PUBLISH ASK
const pubButton = {
    ...menuTags,
    label: "publish to " + host + " catalog",
    formAddress: 'call_made',
    onClick: `@
        if (!links.channelConfigurator.tags.chosenPattern || !links.channelConfigurator.tags.chosenChannelName) {
            os.toast("You must provide a channel name and pattern");
            links.channelConfigurator.showChannelSetupMenu();
            return;
        }
        const confirm = await os.showConfirm({
            title: "confirm request",
            content: "request " + links.channelConfigurator.tags.chosenChannelName + " to be published as a channel?",
            confirmText: "request",
            cancelText: "cancel"
        })
        if (confirm) {
            //request ask
            ab.links.store.abPublishAskID({
                askID: links.channelConfigurator.tags.chosenChannelName,
                studioID: links.channelConfigurator.tags.chosenPatternStudio ?? authBot.id, 
                patternID: links.channelConfigurator.tags.chosenChannelName,
                markerSet: new Set(['abChannel'])
            })
        }
        links.channelConfigurator.showChannelSetupMenu();
    `,
    channelSetupMenuSortOrder: 11,
}

//TEST
const testButton = {
    ...menuTags,
    label: "create test",
    formAddress: 'science',
    onClick: `@
        if (!links.channelConfigurator.tags.chosenPattern || !links.channelConfigurator.tags.chosenChannelName) {
            os.toast("You must provide a channel name and pattern");
            links.channelConfigurator.showChannelSetupMenu();
            return;
        }

        const confirm = await os.showConfirm({
            title: "confirm you have published this channel",
            content: "If this channel is not published you will need to perform extra steps in order to fix all future channel loading.",
            confirmText: "proceed",
            cancelText: "cancel"
        })

        if (confirm) {
            links.channelConfigurator.createTest();
            shout("clearChannelSetupMenu");
        } else {
            links.channelConfigurator.showChannelSetupMenu();
            return;
        }
        
    `,
    channelSetupMenuSortOrder: 12,
}

if (!tags.chosenPattern || !tags.chosenChannelName) {
    createButton.menuItemStyle = {
        filter: `brightness(50%)`
    }
    pubButton.menuItemStyle = {
        filter: `brightness(50%)`
    }

    testButton.menuItemStyle = {
        filter: `brightness(50%)`
    }
}

ab.links.menu.abCreateMenuButton(createButton);
ab.links.menu.abCreateMenuButton(pubButton);
ab.links.menu.abCreateMenuButton(testButton);
