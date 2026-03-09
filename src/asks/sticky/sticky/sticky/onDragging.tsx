const dim = thisBot.vars.dimension;
const deltaX = that.to.x - thisBot.vars.dragStart.x;
const deltaY = that.to.y - thisBot.vars.dragStart.y;

for (var b of thisBot.vars.selectedBots) {
    b.tags[`${dim}X`] = Number(thisBot.vars.startingPoints[b.id].x + deltaX);
    b.tags[`${dim}Y`] = Number(thisBot.vars.startingPoints[b.id].y + deltaY);
}


let selBots = getBots("selected", true);

if(selBots.length == 1){
    let stickyArrowBots = getBots("botID", "stickyArrowNode");
    whisper(stickyArrowBots, "onStickyUpdated", bot.id);

    let stickyScaleBots = getBots("botID", "stickyScaleNode");
    whisper(stickyScaleBots, "onStickyUpdated", bot.id);
}
else{
    for(let i = 0; i < selBots.length; i++){
        let stickyArrowBots = getBots(byTag("botID", "stickyArrowNode"), byTag("stickyBotID",selBots[i].id));
        whisper(stickyArrowBots, "onStickyUpdated", selBots[i].id);

        let stickyScaleBots = getBots(byTag("botID", "stickyScaleNode"), byTag("stickyBotID",selBots[i].id));
        whisper(stickyScaleBots, "onStickyUpdated", selBots[i].id);
    }
}