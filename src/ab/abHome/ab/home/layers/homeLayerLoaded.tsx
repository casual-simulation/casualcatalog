console.log(`[${tags.system}.${tagName}]: home layer loaded ${os.getCurrentInst()}`);

if (!links.learn.abIsPrimary()) {
    return;
}

if (links.navigation.tags.navOpen) {
    superShout("abNavigationMenuRefresh");
    superShout("showSuperNav");
}