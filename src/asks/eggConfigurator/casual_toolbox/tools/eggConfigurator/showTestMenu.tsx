shout('clearEggTestMenu');

configBot.tags.menuPortal = 'eggTestMenu';

const menuTags = {
    clearEggTestMenu: `@destroy(thisBot);`,
    eggTestMenu: true,
    eggConfigurator: getLink(thisBot)
}

//HATCH
const hatchButton = {
    ...menuTags,
    label: "create test",
    gridInfo: that,
    formAddress: 'science',
    onClick: `@
        links.eggConfigurator.hatchEggConfig(tags.gridInfo);
        shout('clearEggTestMenu');
    `,
    eggTestMenuSortOrder: 1,
}

//CHANGE VERSION
const changeVersionButton = {
    ...menuTags,
    formAddress: 'file_copy',
    label: "change version: " + (tags.chosenVersionNumber ?? "current"),
    onClick: `@
        links.eggConfigurator.showVersionMenu();
    `
}

ab.links.menu.abCreateMenuButton(hatchButton);
ab.links.menu.abCreateMenuButton(changeVersionButton);
