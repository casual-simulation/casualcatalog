if (links.learn.abIsPrimary()) {
    const homeBase = getBot(byTag("studioCatalog", true), byTag("respawnPoint", true)); 
    if (!homeBase) {
        thisBot.handleCatalogSetup();
    }
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}