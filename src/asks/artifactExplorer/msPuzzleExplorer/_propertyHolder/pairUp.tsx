let pairingBots = getBots(byTag("pairType", tags.pairType));

pairingBots = pairingBots.sort((a, b) => a.tags.timeAdded - b.tags.timeAdded);

let pairIndex = pairingBots.findIndex(bot => bot.id === thisBot.id);

if(pairIndex % 2 == 0){
    if(pairIndex == pairingBots.length-1){
        setTagMask(thisBot, "color", "grey", "shared");
    }
    else {
        setTagMask(thisBot, "pairedTile", getLink(pairingBots[pairIndex+1]), "shared");
    }
}
else {
    setTagMask(thisBot, "pairedTile", getLink(pairingBots[pairIndex-1]), "shared");
}