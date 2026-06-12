if (that.bot.tags.abAllowEquipment) {
    if (that.bot.tags.abEquipmentBaseSelected) {
        thisBot.onEquipmentBaseDeselected(that.bot);
    } else {
        thisBot.onEquipmentBaseSelected(that.bot);
    }
}