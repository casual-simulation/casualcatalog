const rotBots = await getBots(byTag("rotBot", true));
destroy(rotBots);

// await thisBot.spawnMuseumBuildings();
await thisBot.spawnLandmarks();
await thisBot.spawnArtifacts();