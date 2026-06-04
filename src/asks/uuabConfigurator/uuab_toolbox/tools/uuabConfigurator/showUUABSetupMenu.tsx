shout('clearUUABSetupMenu');

configBot.masks.menuPortal = 'uuabSetupMenu';

const menuTags = {
    clearUUABSetupMenu: `@destroy(thisBot);`,
    uuabSetupMenu: true,
    uuabConfigurator: getLink(thisBot)
}

const editOnUUABButton = {
    ...menuTags,
    label: "edit onLoad function",
    formAddress: 'edit',
    onClick: `@
        configBot.tags.tagPortal = links.uuabConfigurator.id + ".uuab_onUUABLoaded";
    `,
    uuabSetupMenuSortOrder: 2
}

ab.links.menu.abCreateMenuButton(editOnUUABButton);

const editButton = {
    ...menuTags,
    label: "edit",
    formAddress: 'edit',
    onClick: `@
        ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: links.uuabConfigurator.tags.abConfiguratorGroup});
    `,
    uuabSetupMenuSortOrder: 1, 
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
    uuabSetupMenuSortOrder: 3,
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

        links.uuabConfigurator.createTest();
        shout("clearUUABSetupMenu");
    `,
    uuabSetupMenuSortOrder: 4,
}

ab.links.menu.abCreateMenuButton(editButton);
ab.links.menu.abCreateMenuButton(pubButton);
ab.links.menu.abCreateMenuButton(testButton);
