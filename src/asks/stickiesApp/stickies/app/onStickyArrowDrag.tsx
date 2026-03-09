
os.enableCustomDragging();

const dim = thisBot.vars.dimension;
const deltaX = that.to.x - thisBot.vars.dragStart.x;
const deltaY = that.to.y - thisBot.vars.dragStart.y;

let arrowBot = getBot("botID","editStickyNodeArrow");

if(!arrowBot){
    return;
}

arrowBot.tags[`${dim}X`] = Number(thisBot.vars.dragStart.x + deltaX);
arrowBot.tags[`${dim}Y`] = Number(thisBot.vars.dragStart.y + deltaY);