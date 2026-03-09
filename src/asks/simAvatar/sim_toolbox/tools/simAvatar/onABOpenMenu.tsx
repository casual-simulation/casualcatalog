if (tags.remoteID != getID(configBot)) {
    return;
}

if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    simPlayer: getLink(thisBot)
}

const leaveButton = {
    ...menuOptions,
    label: 'leave simulation',
    formAddress: 'exit_to_app',
    onClick: `@
        configBot.tags.gridPortal = 'home';
        const playerBot = getBot(byTag("simPlayer", true), byTag("remoteID", getID(configBot)));
        if (playerBot) {
            playerBot.resetPlayer();
            const roleBot = getBot("simID", playerBot.tags.chosenRole);

            if (roleBot) {
                roleBot.removeRoleOwner();
            }
        }
        
        destroy(links.simPlayer);

        shout("clearActionMenu");
        shout("abMenuRefresh");
    `,
    abMenuSortOrder: -1
}

const restartButton = {
    ...menuOptions,
    label: 'restart simulation',
    formAddress: 'replay',
    onClick: `@
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
        shout("abMenuRefresh");
    `,
    abMenuSortOrder: -2
}

ab.links.menu.abCreateMenuButton(restartButton);
ab.links.menu.abCreateMenuButton(leaveButton);