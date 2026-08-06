
thisBot.vars.busyIndicator = ab.links.menu.abCreateMenuBusyIndicator({
    abMenu: true,
    label: 'checking for updates to ' + abPersonality.tags.abBuilderIdentity,
    abMenuSortOrder: tags.abSelfSelectMenuSortOrder,
});

try {
    thisBot.vars.abUpdateCheck = await ab.abCheckABUpdateAvailable({ detailed: true });
} finally {
    destroy(thisBot.vars.busyIndicator);
    thisBot.vars.busyIndicator = null;
}

if (thisBot.vars.abUpdateCheck && thisBot.vars.abUpdateCheck.success) {
    if (globalThis.abUpdateChecker) {
        abUpdateChecker.tags.updateAvailable = thisBot.vars.abUpdateCheck.updateAvailable;
    }

    if (thisBot.vars.abUpdateCheck.updateAvailable) {
        const abFilesWithUpdates = thisBot.vars.abUpdateCheck.abFileChecks.filter(f => f.updateAvailable);

        const confirmed = await os.showConfirm({
            title: 'Updates found for ' + abPersonality.tags.abBuilderIdentity,
            content: 'There are ' + abFilesWithUpdates.length + ' file updates for ' + abPersonality.tags.abBuilderIdentity + '. Would you like to install the updates now? You and any connected users will automatically refresh the page after the update is complete.',
            cancelText: 'Not now',
            confirmText: 'Yes'
        })

        if (confirmed) {
            ab.updateAB();
            shout('abMenuRefresh');
        }
    } else {
        ab.links.utils.abLogAndToast(abPersonality.tags.abBuilderIdentity + ' is already up-to-date!');
    }
}

if (thisBot.vars.busyIndicator) {
    destroy(thisBot.vars.busyIndicator);
}
