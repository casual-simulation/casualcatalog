if (tags.debug) os.log("Connected to peer inst: " + that.inst);

thisBot.masks.connectingToInst = false;

if (thisBot.masks.instInQueue) {
    thisBot.masks.instInQueue = false;
    whisper(thisBot, "connectToInst");
}