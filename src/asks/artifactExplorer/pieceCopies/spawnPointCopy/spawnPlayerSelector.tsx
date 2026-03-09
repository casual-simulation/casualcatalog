let {
    playerNumber,
} = that;

let basePosition = {
    x: -6,
    y: 4
}

let playerSelectorMods = {
    space: "shared",
    home: true,
    homeX: basePosition.x,
    homeY: basePosition.y - 2*(playerNumber-1),
    basePosition: basePosition,
    label: `Waiting on Player ${playerNumber}...`,
    labelFontSize: 0.9,
    color: "grey",
    selectorNumber: playerNumber,
    getOffset: tags.getOffset,
    scaleX: 3,
    scaleZ: 0.01,
    system: "playerSelectorButton.player" + playerNumber,
    resetTilesetPositions: `@ 
        const offset = thisBot.getOffset(); 
        tags.homeX = tags.basePosition.x + offset.x; 
        tags.homeY = tags.basePosition.x - (2*(tags.selectorNumber-1)) + offset.y;
    `,
    removePlayerSelector: `@ destroy(thisBot);`,
    onClick: `@ 
        if(tags.linkedPlayer){
            let playerBot = getBot(byID(tags.linkedPlayer));
            setTagMask(playerBot, "playerID", null, "shared");
            tags.label = "Waiting on Player " + tags.selectorNumber + "...";
            tags.color = "grey";
            tags.linkedPlayer = null;
        }
        else {
            let playerBot = getBot(byTag("playerNumber", tags.selectorNumber)); 
            setTagMask(playerBot, "playerID", configBot.id, "shared");
            tags.linkedPlayer = playerBot.id;
            tags.label = "Player " + tags.selectorNumber + " Ready!";
            let playerColor = getTag(playerBot, "labelFloatingBackgroundColor");
            tags.color = playerColor ? playerColor : "green";
        }
    `
}

create(playerSelectorMods);

getTag()