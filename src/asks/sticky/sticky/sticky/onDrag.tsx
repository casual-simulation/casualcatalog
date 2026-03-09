os.enableCustomDragging();
let selectedBots = [];
if (masks.justSelected && !configBot.tags.keyboard_Shift) {
    shout('onDeselect');
    whisper(thisBot, 'onSelect');
    selectedBots.push(thisBot);
} else {
    selectedBots = getBots("selected");
}

thisBot.vars.selectedBots = selectedBots;
setTagMask(selectedBots, 'pointable', false);

const dim = os.getCurrentDimension();
thisBot.vars.dimension = dim;

thisBot.vars.dragStart = {x: tags[`${dim}X`] ?? 0, y: tags[`${dim}Y`] ?? 0};

const startingPoints = {};
for (var b of selectedBots) {
    startingPoints[b.id] = {x: b.tags[`${dim}X`] ?? 0, y: b.tags[`${dim}Y`] ?? 0}
}
thisBot.vars.startingPoints = startingPoints;