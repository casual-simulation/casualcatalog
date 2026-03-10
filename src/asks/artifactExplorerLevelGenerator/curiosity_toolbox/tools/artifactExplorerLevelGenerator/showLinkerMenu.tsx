shout('clearLinkerMenu');

configBot.tags.menuPortal = 'linkerMenu';

const menuTags = {
    clearLinkerMenu: `@destroy(thisBot);`,
    linkerMenu: true,
    linker: getLink(thisBot)
}

//HATCH
const hatchButton = {
    ...menuTags,
    label: "create new",
    onClick: `@
        links.linker.hatchNewLink();
    `,
    eggTestMenuSortOrder: 1,
}

ab.links.menu.abCreateMenuButton(hatchButton);
