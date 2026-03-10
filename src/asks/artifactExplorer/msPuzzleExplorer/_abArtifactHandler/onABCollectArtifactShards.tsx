links.player ? null : tags.player = getLink(getBot(byTag("system", "msPuzzleExplorer.playerSpawn")));
links.goal ? null : tags.goal = getLink(getBot(byTag("system", "msPuzzleExplorer.goalSpawn")));
links.wall ? null : tags.wall = getLink(getBot(byTag("system", "msPuzzleExplorer.wallSpawn")));
links.ground ? null : tags.ground = getLink(getBot(byTag("system", "msPuzzleExplorer.groundSpawn")));
links.key ? null : tags.ground = getLink(getBot(byTag("system", "msPuzzleExplorer.keySpawn")));
links.lock ? null : tags.ground = getLink(getBot(byTag("system", "msPuzzleExplorer.lockSpawn")));

let shards = {
    tiles: [],
    tileSet: {
        "player": links.player.tags.formAddress ?? null,
        "goal": links.goal.tags.formAddress ?? null,
        "wall": links.wall.tags.formAddress ?? null,
        "ground": links.ground.tags.formAddress ?? null,
        "key": links.key.tags.formAddress ?? null,
        "lock": links.key.tags.formAddress ?? null
    }
}

getBots(b => {
    if(b.tags.copyType){
        let masks = {
            x: b.masks.homeX,
            y: b.masks.homeY
        }

        setTagMask(b, "homeX", null);
        setTagMask(b, "homeY", null);

        shards.tiles.push({
            tileType: b.tags.copyType,
            tilePosition: {
                "x": b.tags.homeX,
                "y": b.tags.homeY
            },
            tileRotation: b.tags.homeRotationZ
        })

        setTagMask(b, "homeX", masks.x);
        setTagMask(b, "homeY", masks.y);
    }
})

return shards;