if (tags.eggConfigConfirmed) {
    thisBot.showEggSetupMenu();
}
else {
    ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: tags.abConfiguratorGroup});
}

tags.lineTo = tags.lineToValue;