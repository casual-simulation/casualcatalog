const offset = thisBot.getOffset();
const botsToPosition = [
    {
        bot: links.playEdit,
        pos: {
            x: links.playEdit.tags.label == "Play" ? 3 + offset.x : -2 + offset.x,
            y: links.playEdit.tags.label == "Play" ? -6 + offset.y : -6.5 + offset.y
        }
    },
    {
        bot: links.clearBoard,
        pos: {
            x: -4 + offset.x,
            y: -5 + offset.y
        }
    }
]

getBots(b => {
    if(b.tags.tileProperties){
        if(b.tags.tileCopy == true){
            null
        }
        else if(b.tags.tileProperties.spawnPosition) {
            botsToPosition.push({
                bot: b,
                pos: {
                    x: b.tags.tileProperties.spawnPosition.x + offset.x,
                    y: b.tags.tileProperties.spawnPosition.y + offset.y
                }
            })
        }
    }
})

for(const botEntry of botsToPosition){
    setTag(botEntry.bot, "homeX", botEntry.pos.x);
    setTag(botEntry.bot, "homeY", botEntry.pos.y);
}

shout("resetTilesetPositions");
shout("resetBoardTilePositions");