let confirmed = await os.showConfirm({
    title: 'Confirm',
    content: 'This will destroy all bots on your homeworld. Please confirm the action.'
});

if (!confirmed) {
    return;
}

os.toast("backing up home world...");

const backup = await thisBot.saveHomeworld();

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

const currentDim = 'home';
const homeWorldBots = getBots(byTag(currentDim, true), not(byTag("system", sys => sys?.substring(0, 3) == 'ab.')), not(byTag("abIgnore", true)), byTag("space", 'shared'));
const catalogs = getBots(byTag("studioCatalog", true));
const kits = getBots(byTag("abArtifactName", "kit"));

destroy(homeWorldBots);
destroy(catalogs);
destroy(kits);

thisBot.handleCatalogSetup();