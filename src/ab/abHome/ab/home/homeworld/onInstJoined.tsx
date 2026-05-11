superShout("instCheckin", {"config": configBot.tags, "isPrimary": ab.abIsPrimary()});

//prevent automatic map focus
setTagMask(links.remember, "mapPreventFocus", true);

if (links.learn.abIsPrimary()) {
    const homeBase = getBot(byTag("studioCatalog", true), byTag("respawnPoint", true)); 
    if (!homeBase) {
        thisBot.handleCatalogSetup();
    }
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}