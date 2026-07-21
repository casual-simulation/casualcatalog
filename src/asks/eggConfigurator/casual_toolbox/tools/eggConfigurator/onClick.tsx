if (tags.eggConfigConfirmed) {
    thisBot.showEggSetupMenu();
}
else {
    ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: tags.abConfiguratorGroup});
}

if (!tags.isAvatarEquipment) {
    tags.lineTo = tags.lineToValue;
}
