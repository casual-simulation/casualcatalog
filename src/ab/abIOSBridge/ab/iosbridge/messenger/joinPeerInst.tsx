if (tags.debug) os.log("Queuing peer inst: " + that);
if (!thisBot.masks.connectedInsts) {
    thisBot.masks.connectedInsts = [];
} 
thisBot.masks.connectedInsts.push(that);
os.log(thisBot.masks.connectedInsts);
if (!thisBot.masks.connectingToInst) {
    whisper(thisBot, "connectToInst");
} else {
    thisBot.masks.instInQueue = true;
}


// os.loadInst(that);