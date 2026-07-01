setTagMask(that, "abEquipmentBaseSelected", false, "tempShared");
const equipment = getBots("abEquipmentFor", that.id);
for (let i = 0; i < equipment.length; ++i) {
    if (equipment[i].tags.abEquipmentCustomDeselect) {
        equipment[i].abEquipmentCustomDeselect()
    } else {
        const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? that.tags.dimension ?? 'home';
        equipment[i].tags[dimension] = null;
    }
}