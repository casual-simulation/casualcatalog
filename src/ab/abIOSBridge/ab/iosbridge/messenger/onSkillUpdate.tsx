if (!thisBot.masks.connectedInsts) {
    thisBot.masks.connectedInsts = [];
} 
thisBot.masks.connectedInsts.push(configBot.tags.inst);

thisBot.sendAuxInstReady();
// if (thisBot.masks.abAwake) {
//     thisBot.sendAuxInstReady();
// } else {
//     thisBot.masks.waitingForAwake = true;
//     let abShellInput = getBot("system", "ab.shell.input");
//     abShellInput.cmdABWake();
// }