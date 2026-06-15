os.stopFormAnimation(links.defaultVisualBot);
ab.links.equipment.onEquipmentBaseDeselected(thisBot);

if (tags.hasCustomMesh || tags.currentFormAnimation == 'closing' || tags.currentFormAnimation == 'closed') {
    await os.sleep(1000);
    thisBot.hideCatalog();
}