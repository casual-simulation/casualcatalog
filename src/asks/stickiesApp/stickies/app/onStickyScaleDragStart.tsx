
os.enableCustomDragging();

// abRemember.tags.abBotSnapState = false;
// abRemember.tags.abGridSnapState = false;

const dim = os.getCurrentDimension();
thisBot.vars.dimension = dim;

let selBots = getBots("selected", true);

if(selBots.length == 1){
    let parent = getBot("id", bot.tags.stickyHighlightID);

    let stickyBot = getBot("id", parent.tags.selectedBot);
    stickyBot.tags.pointable = false;

    thisBot.vars.parentScaleStart = {x: parent.tags.scaleX, y: parent.tags.scaleY};
    thisBot.vars.parentPosStart = {x: parent.tags[`${dim}X`] ?? 0, y: parent.tags[`${dim}Y`] ?? 0};

    thisBot.vars.dragStart = {x: tags[`${dim}X`] ?? 0, y: tags[`${dim}Y`] ?? 0};
}
else{
    let parent = getBot("id", bot.tags.stickyHighlightID);

    thisBot.vars.selectScaleStart = [];
    thisBot.vars.selectPosStart = [];

    for(let i = 0; i < selBots.length; i++){
        selBots[i].tags.pointable = false;

        thisBot.vars.selectScaleStart.push({x: selBots[i].tags.scaleX, y: selBots[i].tags.scaleY});
        thisBot.vars.selectPosStart.push({x: selBots[i].tags[`${dim}X`] ?? 0, y: selBots[i].tags[`${dim}Y`] ?? 0});
    }

    thisBot.vars.selectedSticky = selBots;
    thisBot.vars.parentScaleStart = {x: parent.tags.scaleX, y: parent.tags.scaleY};
    thisBot.vars.parentPosStart = {x: parent.tags[`${dim}X`] ?? 0, y: parent.tags[`${dim}Y`] ?? 0};

    thisBot.vars.dragStart = {x: tags[`${dim}X`] ?? 0, y: tags[`${dim}Y`] ?? 0};
}
