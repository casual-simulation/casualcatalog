os.stopFormAnimation(links.defaultVisualBot);
ab.links.equipment.onEquipmentBaseDeselected(thisBot);

await os.sleep(600);
const manifestation = getBot(byID(tags.abEquipmentFor));
if (manifestation && !manifestation.tags.abEquipmentBaseSelected) {
    thisBot.hideCatalog();
}