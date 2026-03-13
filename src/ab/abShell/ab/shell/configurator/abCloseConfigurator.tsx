shout('abConfiguratorMenuReset');

if (configBot.masks.menuPortal === 'abConfiguratorMenu') {
    configBot.masks.menuPortal = null;
}

if (thisBot.vars.cachedConfiguratorData) {
    thisBot.vars.cachedConfiguratorData = null;
}