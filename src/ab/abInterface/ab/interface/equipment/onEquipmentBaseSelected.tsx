setTagMask(that, "abEquipmentBaseSelected", true, "tempShared");
const equipment = getBots("abEquipmentFor", that.id);

if (that.tags.abEquipmentExclusiveSelect) {
    const selectedExclusives = getBots(byTag("abEquipmentBaseSelected", true), byTag("abEquipmentExclusiveSelect", true));
    for (const selected of selectedExclusives) {
        if (selected != that) {
            thisBot.onEquipmentBaseDeselected(selected);
        }
    }
}

let abEquipmentMenuOptions = [];

for (let i = 0; i < equipment.length; ++i) {
    if (!equipment[i].tags.abEquipmentExcludeFromGrid) {
        if (equipment[i].tags.abEquipmentCustomSelect) {
            equipment[i].abEquipmentCustomSelect()
        } else {
            const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? that.tags.dimension ?? 'home';
            equipment[i].tags[dimension] = true;
        }
    }

    if (that.tags.abEquipmentShowEquipmentMenu) {
        if (equipment[i].tags.abEquipmentMenuJSON && !equipment[i].tags.abEquipmentExcludeFromMenu) {
            try {
                abEquipmentMenuOptions.push(equipment[i].abEquipmentMenuJSON())
            } catch (e) {
                console.log("Could not add equipment to menu, error running function.");
            }
        }
    }
}

if (that.tags.abEquipmentShowEquipmentMenu) {
    thisBot.showEquipmentMenu({base: that, options: abEquipmentMenuOptions});
}

thisBot.positionEquipment({base: that, equipment});