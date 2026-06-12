for (const changedData of that) {
    if (changedData.tags.includes("abEquipmentFor")) {
        const abEquipmentBase = getBot(byID(changedData.bot.tags.abEquipmentFor));
        if (abEquipmentBase) {
            thisBot.positionEquipment({base: abEquipmentBase, equipment: [changedData.bot]});
        } else {
            if (changedData.bot.tags.lineTo) {
                changedData.bot.tags.lineTo = null;
            }
        }
    }
}
