if (!ab.abIsPrimary()) {
    if (ab.links.manifestation.tags.currentKit == 'log' && configBot.tags.mapPortal) {
        ab.links.menu.abOpenMenu("core");
    }
}