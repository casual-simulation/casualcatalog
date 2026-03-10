let confirmed = await os.showConfirm({
    title: 'Confirm',
    content: 'Please confirm the action.'
});

if (!confirmed) {
    return;
}

os.toast("resetting home base...");

const homeCore = getBot("isHomeWorldCore", true)

if (homeCore) {
    homeCore.tags.saveEnabled = false;
}

const currentDim = ab.links.remember.tags.abActiveDimension;
const homeWorldBots = getBots(byTag(currentDim, true), byTag("system", sys => sys?.substring(0, 3) != 'ab.'), byTag("abIgnore", null), byTag("space", 'shared'));

destroy(homeWorldBots);
destroy(homeCore);

await ab.links.search.onLookupAskID({askID: 'home', channelConfig: false, autoHatch: true, sourceEvent: 'factory_reset_home_base', ignoreReserved: true, eggParameters: {saveOnLoad: true}});