let confirmed = await os.showConfirm({
    title: 'Confirm',
    content: 'This will destroy all bots on your homeworld. Please confirm the action.'
});

if (!confirmed) {
    return;
}

os.toast("backing up home world...");

const backup = await thisBot.backupHomeworld();

if (!backup.success) {
    let confirmed = await os.showConfirm({
        title: 'Backup failed',
        content: 'proceed anyways?'
    });

    if (!confirmed) {
        return;
    }
}

os.toast("resetting home base...");

const homeCore = getBot("isHomeWorldCore", true)

if (homeCore) {
    homeCore.tags.saveEnabled = false;
}

const currentDim = ab.links.remember.tags.abActiveDimension;
const homeWorldBots = getBots(byTag(currentDim, true), not(byTag("system", sys => sys?.substring(0, 3) == 'ab.')), not(byTag("abIgnore", true)), byTag("space", 'shared'));

destroy(homeWorldBots);

await ab.links.search.onLookupAskID({askID: 'home', channelConfig: false, autoHatch: true, sourceEvent: 'factory_reset_home_base', ignoreReserved: true, eggParameters: {saveOnLoad: true}});

destroy(homeCore);