
abRemember.tags.abBotSnapState = true;
abRemember.tags.abGridSnapState = true;

let arrowBots = getBots("botID", "editStickyNodeArrow");
if(!arrowBots){
    return;
}

destroy(arrowBots);

let parent = getBot("id", bot.tags.stickyHighlightID);
if(!parent){
    return;
}
parent.tags.pointable = true;

let selectedBot = getBot("id", parent.tags.selectedBot);
if(!selectedBot){
    return;
}
selectedBot.tags.pointable = true;

let stickyBot = getBot("id", bot.tags.stickyBotID);
if(!stickyBot){
    return;
}
stickyBot.tags.pointable = true;

setTagMask(thisBot.vars.selectedBots, 'pointable', null);
thisBot.vars.selectedBots = null;
thisBot.vars.dimension = null;
thisBot.vars.startingPoints = null;
thisBot.vars.dragStart = null;