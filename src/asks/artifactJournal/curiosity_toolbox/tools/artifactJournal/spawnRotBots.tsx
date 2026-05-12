if (masks.spawningBots) {
    return;
}

masks.spawningBots = true;

try {
   const rotBots = await getBots(byTag("rotBot", true));
    destroy(rotBots);

    // await thisBot.spawnMuseumBuildings();
    await thisBot.spawnLandmarks();
    await thisBot.spawnArtifacts(); 
} catch (e) {
    console.log("Failure spawning bots", e);
}

masks.spawningBots = null;