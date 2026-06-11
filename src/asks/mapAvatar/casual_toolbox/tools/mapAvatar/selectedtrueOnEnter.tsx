const equippedBots = tags.equipment;
for (let i = 0; i < equippedBots.length; ++i) {
    const eBot = getBot("equipmentId", equippedBots[i]);
    whisper(eBot, "onEquippedToBotSelected", thisBot);
}
thisBot.positionEquipment();