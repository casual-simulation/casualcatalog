await os.sleep(50);

if (tags.mode == "play") {

    let spawnerBots = [];
    let playerTile;
    let playerBots = [];

    getBots(b => {
        if (b.tags.system && b.tags.system == "msPuzzleExplorer.playerSpawn") {
            playerTile = b;
        }
        else {
            b.tags.playerSpawnerTile ? spawnerBots.push({ id: b.id, timeAdded: b.tags.timeAdded }) : null;
        }

        if (b.tags.system == "pieceCopies.playerCopy") {
            playerBots.push(b)
        }
    })

    spawnerBots = spawnerBots.sort((a, b) => a.timeAdded - b.timeAdded);
    let spawnerNumber = spawnerBots.findIndex(item => item.id === thisBot.id) + 1;
    console.log("Spawner bots:", spawnerBots, `BotID: ${bot.id}, Number: ${spawnerNumber}`,)

    let extraModsProps = {
        tempPlayerBotRemove: "@ destroy(thisBot)",
        parentBot: thisBot.id,
        // playerTouched: `@ destroy(thisBot)`,
        onDestroy: `@ whisper(tags.parentBot, "spawnPlayerBot", { "playerColor": tags.labelFloatingBackgroundColor })`,
        hide: `@
            if (!ab.links.console.masks.open) {
                whisper(ab.links.console, "showConsole");
                ab.links.console.masks.open = true;
            }
            ab.log("The whale was made to run home and restart their adventure.") 
            destroy(thisBot)
        `,
        home: true,
        playerNumber: spawnerNumber,
        movementAngles: {
            up: Math.PI,
            down: 0,
            left: -Math.PI / 2,
            right: Math.PI / 2
        },
        directionKeys: {
            up: "w",
            down: "s",
            left: "a",
            right: "d"
        },
        controllerTouched: `@ 
            console.log("controllerTouched",that);

            if(!tags.playerID){
                tags.playerID = links.playEdit.tags.currentPlayer;
            }

            if(that.user == tags.playerID){
                thisBot.onKeyDown({ keys: [tags.directionKeys[that.direction]]})
            }
        `,
        setCurrentPlayer: `@ console.log("setCurrentPlayer:", that); tags.playerID = that;`
    }

    if (spawnerBots.length > 1) {
        extraModsProps.label = "Player " + spawnerNumber;
        extraModsProps.labelPosition = "floatingBillboard";
    }

    if (that) {
        that.playerColor ? extraModsProps.labelFloatingBackgroundColor = that.playerColor : null;
    }

    if (playerBots.length < 1) {
        shout("spawnTileCopy", {
            tile: playerTile,
            position: { x: tags.homeX, y: tags.homeY, z: tags.homeZ ? tags.homeZ + 0.01 : 0.01 },
            extraMods: extraModsProps
        })
    }

    // thisBot.spawnPlayerSelector({ "playerNumber": spawnerNumber });

}