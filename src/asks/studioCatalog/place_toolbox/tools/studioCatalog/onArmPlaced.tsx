shout("abMenuRefresh");

if (masks.selectedBots) {
    masks.selectedBots = null;
}

if (!tags.studioId) {
    thisBot.onClick();
    destroy(links.armBot);
} else {
    thisBot.handleToolMenu(that);  
    if (!tags.abEquipmentBaseSelected) {
        ab.links.equipment.onEquipmentBaseSelected(thisBot);
    }
}