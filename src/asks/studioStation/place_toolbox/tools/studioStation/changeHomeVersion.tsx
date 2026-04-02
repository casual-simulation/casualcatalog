//get rid of everything
os.toast("reverting home world...");

tags.saveEnabled = false;

const currentDim = ab.links.remember.tags.abActiveDimension;
const homeWorldBots = getBots(byTag(currentDim, true), not(byTag("system", sys => sys?.substring(0, 3) == 'ab.')), not(byTag("abIgnore", true)), byTag("space", 'shared'));

destroy(homeWorldBots);

//load old version
ab.links.search.onLookupABEggs({recordKey: configBot.tags.studio ?? authBot.id, abID: 'home', abVersion: that, autoHatch: true, sourceEvent: 'ask', eggParameters: {saveOnLoad: true}});
destroy(thisBot);