if (ab.abIsPrimary()) {
    if (ab.links.manifestation.tags.currentKit == 'navigation_kit' && configBot.tags.mapPortal) {
        ab.links.menu.abOpenMenu("core");
    }
}