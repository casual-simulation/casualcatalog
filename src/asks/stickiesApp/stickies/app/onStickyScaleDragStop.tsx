
// abRemember.tags.abBotSnapState = true;
// abRemember.tags.abGridSnapState = true;

let selBots = getBots("selected", true);

if(selBots.length == 1){
    let parent = getBot("id", bot.tags.stickyHighlightID);

    let stickyBot = getBot("id", parent.tags.selectedBot);
    stickyBot.tags.pointable = true;

    setTagMask(thisBot.vars.selectedBots, 'pointable', null);
    thisBot.vars.selectedBots = null;
    thisBot.vars.dimension = null;
    thisBot.vars.startingPoints = null;
    thisBot.vars.dragStart = null;
}else{
    let parent = getBot("id", bot.tags.stickyHighlightID);

    for(let i = 0; i < selBots.length; i++){
        selBots[i].tags.pointable = true;
    }

    setTagMask(thisBot.vars.selectedBots, 'pointable', null);
    thisBot.vars.selectedBots = null;
    thisBot.vars.dimension = null;
    thisBot.vars.startingPoints = null;
    thisBot.vars.dragStart = null;
    thisBot.vars.selectedSticky = null;
}