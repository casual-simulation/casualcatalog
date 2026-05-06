if (tags.expiredInstBot) {
    return;
}

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

if (!tags.instURL) {
    ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: tags.abConfiguratorGroup});
} else {
   os.openURL(tags.instURL); 
}