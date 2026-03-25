const journal = getBot("artifactJournal", true);
let info = journal.tags.artifactData.find(artifact => artifact.id === tags.artifactID);

let infoBot = getBot(byTag("name", "infoMenu"));
infoBot.tags.itemName = info.attributes.Name;
infoBot.tags.itemYear = info.attributes.Year;
if (info.attributes.RealImageUrl) infoBot.tags.imageSrc = info.attributes.RealImageUrl;
else infoBot.tags.imageSrc = info.attributes.PhotoUrl;
infoBot.tags.itemInfo = info.attributes.Description;
infoBot.tags.itemInteractive = info.attributes.Interactive;
infoBot.tags.itemInteractiveLink = info.attributes.InteractiveUrl;
infoBot.tags.itemLink = info.attributes.GRPMUrl;
infoBot.tags.itemCollection = journal.tags.name;



if (journal.tags.currentRegisteredApp) {
    os.unregisterApp(journal.tags.currentRegisteredApp);
    journal.tags.currentRegisteredApp = null;
}
infoBot.openApp();