// const currentURL = new URL(configBot.tags.url);
// const origin = currentURL.origin;

// let newURL = new URL(origin);

// if (configBot.tags.comId) {
//     newURL.searchParams.append("comId", comId);
// }

// newURL.searchParams.append("bios", 'free');

// newURL.searchParams.append("ask", 'rot-launcher');

// os.openURL(newURL.href);

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

if (!tags.artifactData) {
    thisBot.getDataFromStrapi();
}

shout('abMenuRefresh');
shout("clearRoTJournalMenu");

configBot.tags.menuPortal = 'rotJournal_menu';

const menuOptions = {
    rotJournal_menu: true,
    clearRoTJournalMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    journal: getLink(thisBot)
}

const showRotButton = {
    ...menuOptions,
    label: 'show River of Time',
    rotJournal_menuSortOrder: 1,
    onClick: `@
        links.journal.showRoT();
        shout("clearRoTJournalMenu");
    `
}

const hideRotButton = {
    ...menuOptions,
    label: 'hide River of Time',
    rotJournal_menuSortOrder: 1,
    onClick: `@
        links.journal.hideRoT();
        shout("clearRoTJournalMenu");
    `
}

const spawnPlayerButton = {
    ...menuOptions,
    label: 'spawn player',
    rotJournal_menuSortOrder: 2,
    formAddress: 'add_box',
    onClick: `@
        links.journal.spawnPlayer();
        shout("clearRoTJournalMenu");
    `
}

if (tags.rotShown == false) {
    ab.links.menu.abCreateMenuButton(showRotButton);
} else {
    ab.links.menu.abCreateMenuButton(hideRotButton);
    ab.links.menu.abCreateMenuButton(spawnPlayerButton);
}