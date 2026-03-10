const properties = Array.isArray(that) ? that : null;
const tileFunctions = {
    tagsToAdd: {},
    gameStart: [],
    gameEnd: [],
    touched: [],
    left: [],
    levelComplete: []
}

if (properties == null) {
    return tileFunctions;
}
else {
    const tagsToAdd = tileFunctions.tagsToAdd;
    const gameStart = tileFunctions.gameStart;
    const touched = tileFunctions.touched;
    const gameEnd = tileFunctions.gameEnd;
    const levelComplete = tileFunctions.levelComplete;
    const left = tileFunctions.left;

    for (const prop of properties) {
        switch (prop) {
            case "player":
                // const playerNumber = getBots(byTag("playerTile", true)).length + 1;

                tagsToAdd.playerTile = true;
                tagsToAdd.onKeyDown = tags.playerMovement;
                tagsToAdd.onDragging = tags.dragControls;
                tagsToAdd.move = tags.moveTile;
                // tagsToAdd.labelPosition = "floatingBillboard";
                tagsToAdd.labelFloatingBackgroundColor = thisBot.getRandomColor();
                // tagsToAdd.playerNumber = playerNumber;
                // tagsToAdd.label = "Player " + playerNumber;
                tagsToAdd.lock = tags.lockControls;
                tagsToAdd.hide = tags.hideTile;
                tagsToAdd.playerTouched = tags.playerTouched;
                tagsToAdd.labelFontSize = 0.7;
                tagsToAdd.playEdit = tags.playEdit;

                touched.push("thisBot.playerTouched(that);");



                break;
            case "lock":
                tagsToAdd.unlockPuzzleLocks = tags.hideTile;
                break;
            case "key":
                tagsToAdd.keyTouched = `@ shout("unlockPuzzleLocks"); setTagMask(thisBot, "home", false, "shared");`;
                tagsToAdd.logMessage = thisBot.logMessage("The locked gate opened for the whale.")
                touched.push("thisBot.logMessage();")
                touched.push("thisBot.keyTouched();")
                break;
            case "unlock":
                tagsToAdd.unlockTouched = `@ shout("unlockPuzzleLocks");`;
                touched.push("thisBot.unlockTouched();");
                break;
            case "winTile":
                tagsToAdd.winTile = true;
                tagsToAdd.ignoreTouch = false;
                tagsToAdd.winTileTouched = tags.winTileTouched;
                touched.push("thisBot.winTileTouched(that);")
                tagsToAdd.collectablesCheck = tags.collectablesCheck;
                gameStart.push("thisBot.collectablesCheck();");
                tagsToAdd.allCollectablesGotten = `@ masks.color = null; masks.ignoreTouch = null;`;

                break;
            case "moveUpDown":
                tagsToAdd.move = tags.moveTile;
                tagsToAdd.moveUpDown = tags.moveUpDown;
                tagsToAdd.moveAllowed = false;
                gameStart.push(`setTagMask(thisBot, "moveAllowed", uuid(), "shared");`);
                gameStart.push(`thisBot.moveUpDown({ direction:'up', uuid: tags.moveAllowed });`);
                levelComplete.push(`setTagMask(thisBot, "moveAllowed", false, "shared");`);
                break;
            case "moveLeftRight":
                tagsToAdd.move = tags.moveTile;
                tagsToAdd.moveLeftRight = tags.moveLeftRight;
                tagsToAdd.moveAllowed = false;
                gameStart.push(`setTagMask(thisBot, "moveAllowed", uuid(), "shared");`);
                gameStart.push("thisBot.moveLeftRight({ direction: 'left', uuid: tags.moveAllowed });");
                levelComplete.push(`setTagMask(thisBot, "moveAllowed", false, "shared");`);
                break;
            case "harmful":
                tagsToAdd.harmfulTouched = `@ whisper(that, "hide");`;
                tagsToAdd.harmfulTile = true;
                touched.push("thisBot.harmfulTouched(that);");
                break;
            case "playerSpawnpoint":
                tagsToAdd.timeAdded = os.isCollaborative() ? os.agreedUponTime : os.localTime;
                tagsToAdd.countAsPlayer = true;
                tagsToAdd.playerSpawnerTile = true;
                tagsToAdd.spawnPlayerBot = tags.spawnPlayerBot;
                tagsToAdd.removePlayerBot = `@ shout("tempPlayerBotRemove");`;
                tagsToAdd.gameBoard = tags.gameBoard;
                tagsToAdd.getOffset = tags.getOffset;
                tagsToAdd.spawnPlayerSelector = tags.playerSelector;
                gameStart.push("thisBot.spawnPlayerBot();");
                gameStart.push(`setTagMask(thisBot, "home", false, "shared");`)
                gameEnd.push("thisBot.removePlayerBot();");
                gameEnd.push("shout('removePlayerSelector');");
                break;
            case "paired":
                tagsToAdd.timeAdded = os.isCollaborative() ? os.agreedUponTime : os.localTime;
                tagsToAdd.pairType = "portal";
                tagsToAdd.pairUp = tags.pairUp;
                gameStart.push("thisBot.pairUp();");
                break;
            case "teleporter":
                tagsToAdd.teleporterTouched = tags.teleporterTouched;
                touched.push("thisBot.teleporterTouched(that);");
                tagsToAdd.logMessage = thisBot.logMessage("The whale found swam through a magic portal and found themself somewhere else.")
                touched.push("thisBot.logMessage();")
                break;
            case "collectable":
                tagsToAdd.collectableTile = true;
                tagsToAdd.hideTile = tags.hideTile;
                tagsToAdd.collectableTouched = tags.collectableTouched;
                touched.push("thisBot.collectableTouched(that);");
                tagsToAdd.timeAdded = os.isCollaborative() ? os.agreedUponTime : os.localTime;
                tagsToAdd.controller = tags.controller;
                break;
            case "pressurePlate":
                tagsToAdd.pressurePlate = true;
                tagsToAdd.active = false;
                touched.push(`shout("unlockPressureDoors");`);
                left.push(`shout("lockPressureDoors");`);

                tagsToAdd.pressMessage = thisBot.logMessage("Pushing on that tile made the spikes go away.")
                touched.push("thisBot.pressMessage();")

                tagsToAdd.liftMessage = thisBot.logMessage("The spikes came back.")
                left.push("thisBot.liftMessage();")
                break;
            case "pressureDoor":
                tagsToAdd.pressureDoor = true;
                tagsToAdd.maskTileProperties = tags.maskTileProperties;
                tagsToAdd.unlockPressureDoors = tags.hideTile;
                tagsToAdd.lockPressureDoors = `@ masks.home = null; masks.formAddress = null; thisBot.maskTileProperties({ property: "passable", value: false })`;
                break;
            case "pushable":
                tagsToAdd.tilePushed = tags.tilePushed;
                tagsToAdd.move = tags.moveTile;
                touched.push("thisBot.tilePushed(that);");
                tagsToAdd.logMessage = thisBot.logMessage("The whale pushed a heavy rock.");
                touched.push(`thisBot.tags.logMessage ? thisBot.logMessage() : null;`);
                break;
            default:
                console.log(`Tile Property ${prop} is not currently supported.`)
                break;
        }
    }

    return tileFunctions;
}
