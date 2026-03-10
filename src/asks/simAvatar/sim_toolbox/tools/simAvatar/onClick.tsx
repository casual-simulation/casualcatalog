if (tags.remoteID != getID(configBot)) {
    return;
}

shout('abMenuRefresh');
shout("clearSimPlayerMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

// configBot.tags.menuPortal = 'simPlayer_menu';

// const menuOptions = {
//     simPlayer_menu: true,
//     clearSimPlayerMenu: `@destroy(thisBot);`,
//     abMenuRefresh: "@ destroy(thisBot);",
//     simPlayer: getLink(thisBot)
// }

//pull up player menu
const playerBot = await getBot(byTag("simPlayer", true), byTag("remoteID", getID(configBot)));
if (playerBot.tags.simStarted) {
    playerBot.showActionMenu();
} else {
    if (configBot.tags.staticInst) {
        shout("onRemoteData", {
            name: "onStartMenu",
            that: null,
            remoteId: getID(configBot)
        });
    } else {
        const remotes = await os.remotes();
        await sendRemoteData(remotes, "onStartMenu");
    }
}
