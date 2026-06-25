shout('abMenuRefresh');
shout("clearSimPageHandlerMenu");

configBot.tags.menuPortal = 'simPlayer_menu';

const menuOptions = {
    simPlayer_menu: true,
    clearSimPlayerMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    simPlayer: getLink(thisBot)
}

const startButton = {
    ...menuOptions,
    label: 'start',
    formAddress: 'play_arrow',
    onClick: `@
        links.simPlayer.setupPage();
        shout("clearSimPageHandlerMenu");
    `
}

ab.links.menu.abCreateMenuButton(startButton);