const { abArtifactName, abArtifactData } = that;

if (abArtifactName !== tags.abArtifactName) {
    // This reconstitute shout is not for us.
    return;
}

links.player ? null : tags.player = getLink(getBot(byTag("system", "msPuzzleExplorer.playerSpawn")));
links.goal ? null : tags.goal = getLink(getBot(byTag("system", "msPuzzleExplorer.goalSpawn")));
links.wall ? null : tags.wall = getLink(getBot(byTag("system", "msPuzzleExplorer.wallSpawn")));
links.ground ? null : tags.ground = getLink(getBot(byTag("system", "msPuzzleExplorer.groundSpawn")));
links.key ? null : tags.ground = getLink(getBot(byTag("system", "msPuzzleExplorer.keySpawn")));
links.lock ? null : tags.ground = getLink(getBot(byTag("system", "msPuzzleExplorer.lockSpawn")));
links.controller ? null : tags.controller = getLink(getBot(byTag("system", "msPuzzleExplorer.controller")));

if(abArtifactData.tileSet){
    let botLinks = [];

    if(abArtifactData.tileSet.player != null){
        setTag(links.player, "formAddress", abArtifactData.tileSet.player);
        botLinks.push(links.player);
    }
    if(abArtifactData.tileSet.goal != null){
        setTag(links.goal, "formAddress", abArtifactData.tileSet.goal);
        botLinks.push(links.goal);
    }
    if(abArtifactData.tileSet.wall != null){
        setTag(links.wall, "formAddress", abArtifactData.tileSet.wall);
        botLinks.push(links.wall);
    }
    if(abArtifactData.tileSet.ground != null){
        setTag(links.ground, "formAddress", abArtifactData.tileSet.ground);
        botLinks.push(links.ground)
    }
    if(abArtifactData.tileSet.key != null){
        setTag(links.key, "formAddress", abArtifactData.tileSet.key);
        botLinks.push(links.key)
    }
    if(abArtifactData.tileSet.lock != null){
        setTag(links.lock, "formAddress", abArtifactData.tileSet.lock);
        botLinks.push(links.lock)
    }

    setTag(botLinks, "color", null);
    setTag(botLinks, "label", null);
}

if (abArtifactData.tiles) {
    for (const tile of abArtifactData.tiles) {
        let whisperObject = {
            "bot": links[tile.tileType],
            "to": {
                "x": tile.tilePosition.x,
                "y": tile.tilePosition.y
            },
            "from": {
                "x": getTag(links[tile.tileType], "homeX"),
                "y": getTag(links[tile.tileType], "homeY")
            },
            "extraMods": {
                "homeRotationZ": tile.tileRotation
            }
        }

        whisper(links.controller, "onAnyBotDrop", whisperObject);
    }
}