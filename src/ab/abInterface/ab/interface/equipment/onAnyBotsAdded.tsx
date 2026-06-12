for (const newBot of that.bots) {
    if (newBot.tags.abEquipmentFor) {
        const abEquipmentBase = getBot(byID(newBot.tags.abEquipmentFor));
        if (abEquipmentBase) {
            thisBot.positionEquipment({base: abEquipmentBase, equipment: [newBot]});
        }
    }
}