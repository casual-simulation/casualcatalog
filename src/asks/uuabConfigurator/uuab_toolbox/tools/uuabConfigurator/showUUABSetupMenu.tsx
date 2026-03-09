shout('clearUUABSetupMenu');

configBot.masks.menuPortal = 'uuabSetupMenu';

const menuTags = {
    clearUUABSetupMenu: `@destroy(thisBot);`,
    uuabSetupMenu: true,
    uuabConfigurator: getLink(thisBot)
}

const uuabNameButton = {
    ...menuTags,
    label: "uuab name: " + (tags.chosenUUABName || ''),
    onClick: `@
        const instName = await os.showInput(links.uuabConfigurator.tags.chosenUUABName || "", {
            title: 'choose a name for your uuab'
        });

        links.uuabConfigurator.tags.chosenUUABName = instName;
        links.uuabConfigurator.tags.uuabSetupLabel = instName;
        links.uuabConfigurator.updateBillboardLabel();
        links.uuabConfigurator.showUUABSetupMenu();
    `,
    uuabSetupMenuSortOrder: 1
}

ab.links.menu.abCreateMenuButton(uuabNameButton);

const biosButton = {
    ...menuTags,
    label: "inst type: " + (tags.chosenBIOS || ''),
    dropdownSortOrder: 2,
    dropdownOptions: [
        {
            label: "free",
            ...menuTags,
            onClick: `@
                links.uuabConfigurator.tags.chosenBIOS = "free";
                links.uuabConfigurator.showUUABSetupMenu();
            `
        },
        {
            label: "studio",
            ...menuTags,
            onClick: `@
                links.uuabConfigurator.tags.chosenBIOS = "studio";
                links.uuabConfigurator.showUUABSetupMenu();
            `
        },
        {
            label: "local",
            ...menuTags,
            onClick: `@
                links.uuabConfigurator.tags.chosenBIOS = "local";
                links.uuabConfigurator.showUUABSetupMenu();
            `
        }
    ]
}

ab.links.menu.abCreateMenuDropdown(biosButton);


const instNameButton = {
    ...menuTags,
    label: "inst name: " + (tags.chosenInstName || ''),
    onClick: `@
        const instName = await os.showInput(links.uuabConfigurator.tags.chosenInstName || "", {
            title: 'choose an inst name'
        });

        links.uuabConfigurator.tags.chosenInstName = instName;
        links.uuabConfigurator.showUUABSetupMenu();
    `,
    uuabSetupMenuSortOrder: 3
}

ab.links.menu.abCreateMenuButton(instNameButton);


const patternButton = {
    ...menuTags,
    label: "pattern: " + (tags.chosenPattern || ""),
    onClick: `@
        const patternName = await os.showInput(links.uuabConfigurator.tags.chosenPattern || "", {
            title: 'choose a pattern for this uuab'
        });

        links.uuabConfigurator.tags.chosenPattern = patternName;

        if (!links.uuabConfigurator.tags.chosenPatternStudio && authBot) {
            links.uuabConfigurator.tags.chosenPatternStudio = authBot.id;
        }
        links.uuabConfigurator.showUUABSetupMenu();
    `,
    uuabSetupMenuSortOrder: 4
}

ab.links.menu.abCreateMenuButton(patternButton);

const patternStudioButton = {
    ...menuTags,
    label: "pattern studio: " + (tags.chosenPatternStudio ? tags.chosenPatternStudio != authBot?.id ? tags.chosenPatternStudio : 'user' : ""),
    onClick: `@
        const patternName = await os.showInput(links.uuabConfigurator.tags.chosenPatternStudio || "", {
            title: 'what studio is this pattern in?'
        });

        links.uuabConfigurator.tags.chosenPatternStudio = patternName == 'user' ? authBot.id : patternName;
        links.uuabConfigurator.showUUABSetupMenu();
    `,
    uuabSetupMenuSortOrder: 5
}

ab.links.menu.abCreateMenuButton(patternStudioButton);

const editOnUUABButton = {
    ...menuTags,
    label: "edit onUUABLoaded",
    formAddress: 'edit',
    onClick: `@
        configBot.tags.tagPortal = links.uuabConfigurator.id + ".uuab_onUUABLoaded";
    `,
    uuabSetupMenuSortOrder: 6
}

ab.links.menu.abCreateMenuButton(editOnUUABButton);

const createButton = {
    ...menuTags,
    label: "save changes",
    formAddress: 'publish',
    onClick: `@
        if (links.uuabConfigurator.tags.chosenUUABName) {
            links.uuabConfigurator.createUUAB();
        } else {
            os.toast("You must provide a uuab name");
        }
        
    `,
    uuabSetupMenuSortOrder: 10,
    
}

const currentURL = new URL(configBot.tags.url);
const host = currentURL.host;
//PUBLISH ASK
const pubButton = {
    ...menuTags,
    label: "publish to " + host + " catalog",
    formAddress: 'call_made',
    onClick: `@
        if (!links.uuabConfigurator.tags.chosenUUABName) {
            os.toast("You must provide a uuab name");
            links.uuabConfigurator.showUUABSetupMenu();
            return;
        }
        const confirm = await os.showConfirm({
            title: "confirm request",
            content: "request " + links.uuabConfigurator.tags.chosenUUABName + " to be published as a uuab?",
            confirmText: "request",
            cancelText: "cancel"
        })
        if (confirm) {
            //request ask
            ab.links.store.abPublishAskID({askID: links.uuabConfigurator.tags.chosenUUABName, studioID: links.uuabConfigurator.tags.chosenPatternStudio ?? authBot.id, patternID: links.uuabConfigurator.tags.chosenUUABName})
        }
        links.uuabConfigurator.showUUABSetupMenu();
    `,
    uuabSetupMenuSortOrder: 11,
}

//TEST
const testButton = {
    ...menuTags,
    label: "create test",
    formAddress: 'science',
    onClick: `@
        if (!links.uuabConfigurator.tags.chosenUUABName) {
            os.toast("You must provide a uuab name");
            links.uuabConfigurator.showUUABSetupMenu();
            return;
        }

        const confirm = await os.showConfirm({
            title: "confirm you have saved this uuab",
            content: "If this uuab's changed have not been saved your uuab will not appear correctly.",
            confirmText: "proceed",
            cancelText: "cancel"
        })

        if (confirm) {
            links.uuabConfigurator.createTest();
            shout("clearUUABSetupMenu");
        } else {
            links.uuabConfigurator.showUUABSetupMenu();
            return;
        }
        
    `,
    uuabSetupMenuSortOrder: 12,
}

if (!tags.chosenUUABName) {
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
