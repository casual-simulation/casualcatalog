setTagMask(that, "abEquipmentBaseSelected", true, "tempShared");
const equipment = getBots("abEquipmentFor", that.id);
for (let i = 0; i < equipment.length; ++i) {
    if (equipment[i].tags.abEquipmentCustomSelect) {
        equipment[i].abEquipmentCustomSelect()
    } else {
        const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? that.tags.dimension ?? 'home';
        equipment[i].tags[dimension] = true;
    }
}

thisBot.positionEquipment({base: that, equipment});