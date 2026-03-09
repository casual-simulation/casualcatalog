if (thisBot.vars.artifactMenuBots && thisBot.vars.artifactMenuBots.length > 0) {
    destroy(thisBot.vars.artifactMenuBots);
    thisBot.vars.artifactMenuBots = [];
}

configBot.masks.menuPortal = null;
masks.selectedArtifactBotId = null;