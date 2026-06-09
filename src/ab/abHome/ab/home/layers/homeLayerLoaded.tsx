if (!ab.abIsPrimary()) {
    return;
}

if (links.navigation.tags.navOpen) {
    superShout("abNavigationMenuRefresh");
    superShout("showSuperNav");
}