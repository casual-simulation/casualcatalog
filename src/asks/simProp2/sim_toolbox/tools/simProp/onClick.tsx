shout('abMenuRefresh');
shout("clearSimPropMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

if (!tags.propLocked) {
    ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: tags.abConfiguratorGroup});   
}