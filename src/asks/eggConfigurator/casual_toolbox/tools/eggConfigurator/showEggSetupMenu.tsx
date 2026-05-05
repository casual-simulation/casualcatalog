shout('clearEggSetupMenu');

configBot.tags.menuPortal = 'eggSetupMenu';

const menuTags = {
    clearEggSetupMenu: `@destroy(thisBot);`,
    eggSetupMenu: true,
    eggConfigurator: getLink(thisBot)
}

//EGG NAME
const eggNameButton = {
    ...menuTags,
    label: tags.eggConfigConfirmed ? tags.chosenEggName : "egg name: " + (tags.chosenEggName || ''),
    color: ab.links.personality.tags.abBaseMenuColor,
    onClick: tags.eggConfigConfirmed ? null : `@
        const instName = await os.showInput(links.eggConfigurator.tags.chosenEggName || "", {
            title: 'choose a name for your egg'
        });

        links.eggConfigurator.tags.chosenEggName = instName;
        links.eggConfigurator.tags.label = instName;
        links.eggConfigurator.showEggSetupMenu();
    `,
    eggSetupMenuSortOrder: 1
}

//STUDIO
const studioButton = {
    ...menuTags,
    label: "studio: " + (tags.chosenStudio ?? 'user'),
    color: ab.links.personality.tags.abBaseMenuColor,
    onClick: tags.eggConfigConfirmed ? null : `@
        const studioName = await os.showInput(links.eggConfigurator.tags.chosenStudio || "", {
            title: 'provide a studio'
        });

        links.eggConfigurator.tags.chosenStudio = studioName;
        links.eggConfigurator.showEggSetupMenu();
    `,
    eggSetupMenuSortOrder: 2
}

//CREATE
const createButton = {
    ...menuTags,
    label: "create egg",
    formAddress: 'add',
    onClick: `@
        if (links.eggConfigurator.tags.chosenEggName) {
            if (!links.eggConfigurator.tags.chosenStudio) {
                links.eggConfigurator.tags.chosenStudio = authBot.id;
            }
            links.eggConfigurator.publishEggConfigurator();
        } else {
            os.toast("You must provide an egg name");
        }
    `,
    eggSetupMenuSortOrder: 10,
}

if (!tags.chosenEggName) {
    createButton.menuItemStyle = {
        filter: `brightness(50%)`
    }
}

//TEST
const testButton = {
    ...menuTags,
    label: "test",
    formAddress: 'science',
    onClick: `@
        links.eggConfigurator.showTestMenu();
        shout("clearEggSetupMenu");
    `,
    eggSetupMenuSortOrder: 10,
}

const currentURL = new URL(configBot.tags.url);
const host = currentURL.host;

//PUBLISH ASK
const pubButton = {
    ...menuTags,
    label: "publish to " + host + " catalog",
    formAddress: 'call_made',
    onClick: `@
        const confirm = await os.showConfirm({
            title: "confirm request",
            content: "request " + links.eggConfigurator.tags.chosenEggName + " to be published to catalog?",
            confirmText: "request",
            cancelText: "cancel"
        })
        if (confirm) {
            //request ask
            ab.links.store.abPublishAskID({askID: links.eggConfigurator.tags.chosenEggName, studioID: links.eggConfigurator.tags.chosenStudio ?? authBot.id, patternID: links.eggConfigurator.tags.chosenEggName})
        }
        links.eggConfigurator.showEggSetupMenu();
    `,
    eggSetupMenuSortOrder: 10,
}

if (!tags.eggConfigConfirmed) {
    ab.links.menu.abCreateMenuButton(eggNameButton);
    ab.links.menu.abCreateMenuButton(studioButton);
    ab.links.menu.abCreateMenuButton(createButton);
} else {
    ab.links.menu.abCreateMenuText(eggNameButton);
    ab.links.menu.abCreateMenuText(studioButton);
    ab.links.menu.abCreateMenuButton(testButton);
    ab.links.menu.abCreateMenuButton(pubButton);
}
