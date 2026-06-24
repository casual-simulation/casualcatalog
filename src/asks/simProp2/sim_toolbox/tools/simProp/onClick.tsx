shout('abMenuRefresh');
shout("clearSimPropMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

const triggerBot = getBot("choosingProp", true);

if (triggerBot) {
    triggerBot.addTrigger(thisBot);
    tags.color = tags.prevColor;
    tags.prevColor = null;
    return;
}

configBot.tags.menuPortal = 'simProp_menu';

const menuOptions = {
    simProp_menu: true,
    clearSimPropMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    prop: getLink(thisBot)
}

if (!tags.propLocked) {
    ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: tags.abConfiguratorGroup});   
}