const selectedBots = getBots("abEquipmentBaseSelected", true);
for (const selectedBot of selectedBots) {
    thisBot.onEquipmentBaseDeselected(selectedBot);
}