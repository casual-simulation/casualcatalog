if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

shout('abMenuRefresh');
shout("clearKitMenu");

configBot.tags.menuPortal = 'kit_menu';

const menuOptions = {
    kit_menu: true,
    clearKitMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@destroy(thisBot);",
    kit: getLink(thisBot)
}