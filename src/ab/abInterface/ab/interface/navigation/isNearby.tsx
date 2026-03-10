const bot1 = that.bot1;
const bot2 = that.bot2;
const maxDistance = that.maxDistance;
const dimension = that.dimension;

if (!bot1 || !bot2) {
    return;
}

let inMap = configBot.tags.mapPortal ? true : false;
if (dimension) {
    inMap = configBot.tags.mapPortal && configBot.tags.mapPortal == dimension ? true : false;
}
const currDimension = dimension ?? configBot.tags.mapPortal ?? configBot.tags.gridPortal;
let distance = maxDistance ?? (inMap ? .001 : 3);

let nearby = true;
if (Math.abs(bot2.tags[currDimension + 'X'] - bot1.tags[currDimension + 'X']) > distance) {
    nearby = false;
}

if (Math.abs(bot2.tags[currDimension + 'Y'] - bot1.tags[currDimension + 'Y']) > distance) {
    nearby = false;
}

return nearby;