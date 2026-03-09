const rotBots = getBots(byTag("rotBot", true), byTag("landmark", true));
const museumBots = getBots(byTag("rotBot", true), byTag("museumBot", true));

if (rotBots.length == 0) {
    thisBot.spawnRotBots();
}

for (let i = 0; i < rotBots.length; ++i) {
    rotBots[i].tags.home = true;
}

for (let j = 0; j < museumBots.length; ++j) {
    museumBots[j].tags.home = true;
}

const hudBot = getBot("name", "hudMenu");
if (hudBot) {
    hudBot.openApp();
}

tags.rotShown = true;