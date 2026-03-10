if (tags.debug) os.log("AB awoke!");
thisBot.masks.abAwake = true;

if (thisBot.masks.waitingForAwake) {
    thisBot.masks.waitingForAwake = false;
    thisBot.sendAuxInstReady();
}