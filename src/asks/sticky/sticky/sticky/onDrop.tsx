setTagMask(thisBot.vars.selectedBots, 'pointable', null);
thisBot.vars.selectedBots = null;
thisBot.vars.dimension = null;
thisBot.vars.startingPoints = null;
thisBot.vars.dragStart = null;

if (masks.justSelected) {
    whisper(thisBot, "onDeselect")
}