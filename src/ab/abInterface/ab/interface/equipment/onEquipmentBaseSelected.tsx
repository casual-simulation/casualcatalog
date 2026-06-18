setTagMask(that, "abEquipmentBaseSelected", true, "tempShared");
const equipment = getBots("abEquipmentFor", that.id);

let abEquipmentMenuOptions = [];

for (let i = 0; i < equipment.length; ++i) {
    if (equipment[i].tags.abEquipmentCustomSelect) {
        equipment[i].abEquipmentCustomSelect()
    } else {
        const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? that.tags.dimension ?? 'home';
        equipment[i].tags[dimension] = true;
    }

    if (that.tags.abEquipmentShowEquipmentMenu) {
        if (equipment[i].tags.abEquipmentMenuJSON) {
            try {
                abEquipmentMenuOptions.push(equipment[i].abEquipmentMenuJSON())
            } catch (e) {
                console.log("Could not add equipment to menu, error running function.");
            }
        }
    }
}

thisBot.showEquipmentMenu({base: that, options: abEquipmentMenuOptions});

thisBot.positionEquipment({base: that, equipment});