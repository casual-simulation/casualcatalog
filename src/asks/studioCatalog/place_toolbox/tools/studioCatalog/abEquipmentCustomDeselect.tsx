os.stopFormAnimation(links.defaultVisualBot);
ab.links.equipment.onEquipmentBaseDeselected(thisBot);

if (tags.hasCustomMesh || tags.currentFormAnimation == 'closing' || tags.currentFormAnimation == 'closed') {
    thisBot.hideCatalog();
}