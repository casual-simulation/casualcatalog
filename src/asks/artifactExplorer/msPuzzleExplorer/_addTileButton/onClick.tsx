let tileProperties = `🧬{
    "tileType": "newTile",
    "passable": true,
    "lock": false,
    "key": false,
    "unlock": false,
    "winTile": false,
    "moveUpDown": false,
    "moveLeftRight": false,
    "harmful": false,
    "playerSpawnpoint": false,
    "paired": false,
    "teleporter": false,
    "collectable": false,
    "pressurePlate": false,
    "pressureDoor": false,
    "pushable": false,
    "spawnPosition": {
        "x": ${tags.homeX},
        "y": ${tags.homeY}
    }
}`;

let offset = thisBot.getOffset();

let newPosMods = {
    homeX: tags.homeX >= 3 + offset.x ? -3 + offset.x : tags.homeX + 2,
    homeY: tags.homeX >= 3 + offset.x ? tags.homeY - 2 : tags.homeY
}

create(thisBot, newPosMods);

await os.sleep(50);

tags.label = "new tile";
tags.getOffset = null;
tags.onClick = null;
tags.gameBoard = null;
tags.labelFontSize = 0.8;
tags.tileProperties = tileProperties;