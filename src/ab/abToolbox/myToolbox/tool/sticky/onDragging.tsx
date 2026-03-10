const dim = thisBot.vars.dimension;
const deltaX = that.to.x - thisBot.vars.dragStart.x;
const deltaY = that.to.y - thisBot.vars.dragStart.y;

for (var b of thisBot.vars.selectedBots) {
    b.tags[`${dim}X`] = Number(thisBot.vars.startingPoints[b.id].x + deltaX);
    b.tags[`${dim}Y`] = Number(thisBot.vars.startingPoints[b.id].y + deltaY);
}