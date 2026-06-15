superShout("instCheckin", JSON.stringify({"config": configBot.tags.inst, "isPrimary": links.learn.abIsPrimary()}));

if (links.learn.abIsPrimary()) {
    //prevent automatic map focus
    setTagMask(links.remember, "mapPreventFocus", true);

    // const homeBase = getBot(byTag("studioCatalog", true), byTag("respawnPoint", true)); 
    // if (!homeBase) {
    //     thisBot.handleCatalogSetup();
    // }
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}