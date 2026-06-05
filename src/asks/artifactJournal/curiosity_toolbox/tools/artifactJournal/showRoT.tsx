const rotBots = getBots(byTag("rotBot", true), byTag("landmark", true));

if (rotBots.length == 0) {
    thisBot.spawnRotBots();
}

for (let i = 0; i < rotBots.length; ++i) {
    rotBots[i].tags.home = true;
}