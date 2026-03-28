const value = that.value;
const unit = that.unit;

for (const attr in tags.modelAttributes) {
    
    if (!tags.modelAttributes[attr].unit.includes(unit)) {
        continue;
    }

    const delta = tags.modelAttributes[attr].delta;
    let deltaValue;
    
    
    if (delta.includes('+')) {
        deltaValue = Number(delta.replaceAll('+', ''));
        if (deltaValue) {
            thisBot.editAttribute({attributeName: attr, value: Number(tags.modelAttributes[attr].start) + (deltaValue * value)});
        }
    } else if (delta.includes('-')) {
        deltaValue = Number(delta.replaceAll('-', ''));
        if (deltaValue) {
            thisBot.editAttribute({attributeName: attr, value: Number(tags.modelAttributes[attr].start) - (deltaValue * value)});
        }
    } else if (delta.includes('/')) {
        deltaValue = Number(delta.replaceAll('/', ''));
        if (deltaValue) {
            thisBot.editAttribute({attributeName: attr, value: Number(tags.modelAttributes[attr].start) / (deltaValue * value)});
        }
    } else if (delta.includes('*')) {
        deltaValue = Number(delta.replaceAll('*', ''));
        if (deltaValue) {
            thisBot.editAttribute({attributeName: attr, value: Number(tags.modelAttributes[attr].start) * (deltaValue * value)});
        }
    }
}