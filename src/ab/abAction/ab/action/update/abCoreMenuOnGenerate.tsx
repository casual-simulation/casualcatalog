if (!globalThis.abUpdateChecker) {
    destroy(thisBot);
    return;
}

tags.refreshDisplay = `@
    if (thisBot.vars.busyIndicator) {
        destroy(thisBot.vars.busyIndicator);
        thisBot.vars.busyIndicator = null;
    }

    // Clear tag masks.
    masks.abMenu = null;
    masks.label = null;
    masks.color = null;
    masks.formAddress = null;
    
    if (abUpdateChecker.tags.updateAvailable) {
        masks.label = 'update ' + abPersonality.tags.abBuilderIdentity;
        masks.color = '#A4DD00';
        masks.formAddress = 'update';
    } else {
        if (abUpdateChecker.tags.checking) {
            // Temporarily replace with busy indicator while checking for updates.
            thisBot.vars.busyIndicator = ab.links.menu.abCreateMenuBusyIndicator({
                abMenu: true,
                label: 'checking for updates to ' + abPersonality.tags.abBuilderIdentity,
                abMenuSortOrder: tags.abMenuSortOrder,
            });

            masks.abMenu = false;
        } else {
            // AB is up-to-date.
            masks.abMenu = false;
        }
    }
`;

tags.onDestroy = `@
    if (thisBot.vars.busyIndicator) {
        destroy(thisBot.vars.busyIndicator);
        thisBot.vars.busyIndicator = null;
    }

    if (thisBot.vars.onABUpdateCheckerBotChanged) {
        os.removeBotListener(abUpdateChecker, 'onBotChanged', thisBot.vars.onABUpdateCheckerBotChanged);
    }
`

thisBot.vars.onABUpdateCheckerBotChanged = (listenerThat) => {
    const needRefreshDisplay = listenerThat.tags.some(t => t === 'checking' || t === 'updateAvailable');
    if (needRefreshDisplay) {
        thisBot.refreshDisplay();
    }
}

os.addBotListener(abUpdateChecker, 'onBotChanged', thisBot.vars.onABUpdateCheckerBotChanged);

thisBot.refreshDisplay();