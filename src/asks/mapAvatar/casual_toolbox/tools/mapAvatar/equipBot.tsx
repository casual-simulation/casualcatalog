const equipmentBot = getBot("equipmentId", that);
if (!equipmentBot) {
    console.log(`[${tags.system}.${tagName}]: Could not find bot to equip. Please provide a valid equipmentId tag.`);
    return;
}

if (!tags.equipment) {
    tags.equipment = [];
}

if (!tags.equipment.includes(that)) {
    tags.equipment.push(that);
}

changeState(thisBot, true, "selected");
thisBot.positionEquipment();