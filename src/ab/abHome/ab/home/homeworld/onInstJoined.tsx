superShout("instCheckin", {"config": configBot.tags, "isPrimary": ab.abIsPrimary()});

if (links.learn.abIsPrimary()) {
    //prevent automatic map focus
    setTagMask(links.remember, "mapPreventFocus", true);

    const homeBase = getBot(byTag("studioCatalog", true), byTag("respawnPoint", true)); 
    if (!homeBase) {
        thisBot.handleCatalogSetup();
    }
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}