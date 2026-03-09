os.toast("resetting home base...");

const homeCore = getBot("isHomeWorldCore", true)

if (homeCore) {
    homeCore.tags.saveEnabled = false;
}

const homeWorldBots = getBots("homeWorldBot", true);
destroy(homeWorldBots);

await ab.links.search.onLookupAskID({askID: 'home', channelConfig: false, autoHatch: true, sourceEvent: 'factory_reset_home_base', ignoreReserved: true});