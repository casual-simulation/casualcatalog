if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: 'scaleModelWizard' });