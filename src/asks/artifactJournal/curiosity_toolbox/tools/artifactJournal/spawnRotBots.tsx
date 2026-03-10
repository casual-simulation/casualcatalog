if (masks.spawningBots) {
    return;
}

masks.spawningBots = true;
const rotBots = await getBots(byTag("rotBot", true));
destroy(rotBots);

// await thisBot.spawnMuseumBuildings();
await thisBot.spawnLandmarks();
await thisBot.spawnArtifacts();

masks.spawningBots = null;