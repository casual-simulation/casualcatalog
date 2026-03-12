shout('abConfiguratorMenuReset');

if (configBot.tags.menuPortal === 'abConfiguratorMenu') {
    configBot.tags.menuPortal = null;
}

if (thisBot.vars.cachedConfiguratorData) {
    thisBot.vars.cachedConfiguratorData = null;
}