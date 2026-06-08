if (!thisBot.masks.connectedInsts) {
    thisBot.masks.connectedInsts = [];
} 
thisBot.masks.connectedInsts.push(configBot.tags.inst);

thisBot.sendAuxInstReady();