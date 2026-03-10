if (tags.debug) os.log("Connecting to peer inst");
os.log(thisBot.masks.connectedInsts)
configBot.tags.inst = thisBot.masks.connectedInsts;
thisBot.masks.connectingToInst = true;