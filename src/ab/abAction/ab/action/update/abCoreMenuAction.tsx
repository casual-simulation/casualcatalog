if (!abUpdateChecker.tags.checking) {
    if (abUpdateChecker.tags.updateAvailable) {
        const confirmed = await os.showConfirm({
            title: 'Install ' + abPersonality.tags.abBuilderIdentity + ' updates?',
            content: 'Would you like to install the ' + abPersonality.tags.abBuilderIdentity + ' updates? You and any connected users will automatically refresh the page after the update is complete.',
            cancelText: 'Not now',
            confirmText: 'Yes'
        })

        if (confirmed) {
            ab.updateAB();
            shout('abMenuRefresh');
        }
    }
}