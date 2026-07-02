//For equipment to work the equipped item must include a onBotChanged tag with a shout onEquipmentChanged({bot: thisBot, tags: that})
if (that.tags.includes("abEquipmentFor")) {
    const abEquipmentBase = getBot(byID(that.bot.tags.abEquipmentFor));
    if (abEquipmentBase) {
        thisBot.positionEquipment({base: abEquipmentBase, equipment: [that.bot]});
    } else {
        if (that.bot.tags.lineTo) {
            that.bot.tags.lineTo = null;
        }
    }
}
