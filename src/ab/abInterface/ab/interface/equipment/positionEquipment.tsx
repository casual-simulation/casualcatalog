const equipmentOffsets = [{x: 3, y: 0}, {x: 0, y: 3} ,{x: -3, y: 0}, {x: 0, y: -3},
                          {x: 3, y: 3}, {x: -3, y: 3}, {x: -3, y: -3}, {x: 3, y: -3}, 
                          {x: 5, y: 2}, {x: 2, y: 5}, {x: -2, y: 5}, {x: -5, y: 2},
                          {x: -5, y: -2}, {x: -2, y: -5}, {x: 2, y: -5}, {x: 5, y: -2},]

const mapRatio = .00012108755;

const sortedEquipment = that.equipment.toSorted((a, b) => a.tags.abCreateTime - b.tags.abCreateTime)

for (let i = 0; i < sortedEquipment?.length; ++i) {
    const dimension = configBot.tags.mapPortal ?? configBot.tags.gridPortal ?? that.base?.tags.dimension ?? "home";
    const isMap = configBot.tags.mapPortal ? true : false;
    
    for (let j = 0; j < equipmentOffsets.length; ++j) {
        let xValue = equipmentOffsets[j].x;
        if (isMap) xValue = xValue * mapRatio;

        let yValue = equipmentOffsets[j].y;
        if (isMap) yValue = yValue * mapRatio;

        xValue = (that.base.tags[dimension + 'X'] ?? 0) + xValue;
        yValue = (that.base.tags[dimension + 'Y'] ?? 0) + yValue;

        const botsInPosition = getBots(byTag(dimension + 'X', xVal => Math.abs(xVal - xValue) < .00001), byTag(dimension + 'Y', yVal => Math.abs(yVal - yValue) < .00001));
        let occupied = false;
        for (const pBot of botsInPosition) {
            if (pBot == sortedEquipment[i]) {
                continue;
            }
            if (pBot.tags.abEquipmentIgnore) {
                continue;
            }
            let pIndex = sortedEquipment.findIndex(eBot => eBot.id == pBot.id);
            if (pIndex && pIndex > i) {
                continue;
            }
            occupied = true;
            break;
            
        }
        if (occupied == false) {
            sortedEquipment[i].tags[dimension + 'X'] = xValue;
            sortedEquipment[i].tags[dimension + 'Y'] = yValue;
            break;
        }
    }

    sortedEquipment[i].tags.lineTo = getID(that.base);
}