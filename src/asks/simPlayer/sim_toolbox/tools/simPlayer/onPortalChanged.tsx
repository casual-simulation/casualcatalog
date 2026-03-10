if (that.portal == "gridPortal" && that.dimension != 'home' && that.dimension != 'blueprint') {
    const playerBot = getBot(byTag("simPlayer", true), byTag("remoteID", getID(configBot)));
    if (!playerBot) {
        configBot.tags.gridPortal = 'home';
    }
}