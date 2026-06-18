const selectedBots = getBots("abEquipmentBaseSelected", true);
for (const selectedBot of selectedBots) {
    console.log("newSelly", selectedBot)
    thisBot.onEquipmentBaseDeselected(selectedBot);
}