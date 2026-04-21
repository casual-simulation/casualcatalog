const {
    dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal
} = that ?? {}

if (!dimension) {
    return;
}

if (!authBot) {
    os.showAlert({
        title: 'sign in required',
        content: 'you must sign in to use ai.'
    });
    return;
}

masks.pendingDimension = dimension;

ab.links.configurator.abOpenConfigurator({
    abConfiguratorGroup: tags.abConfiguratorGroup,
    abConfiguratorTitle: 'create an agent',
});

thisBot.animateSpin();
