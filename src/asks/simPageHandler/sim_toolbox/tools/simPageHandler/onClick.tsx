shout('abMenuRefresh');
shout("clearSimPageHandlerMenu");

//handle right click
if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

configBot.tags.menuPortal = 'simPlayer_menu';

const menuOptions = {
    simPlayer_menu: true,
    clearSimPlayerMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    simPlayer: getLink(thisBot)
}