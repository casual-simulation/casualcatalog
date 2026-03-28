const value = that.value;
const unit = that.unit;

for (const attr of tags.modelAttributes) {
    if (!tags.modelAttributes[attr].unit.includes(unit)) {
        continue;
    }

    const delta = tags.modelAttributes[attr].delta;
    let deltaValue;
    if (delta.includes('+')) {
        deltaValue = Number(delta.slice(delta.indexOf('+'), 1));
        if (deltaValue) {
            thisBot.editAttribute({attributeName: attr, value: tags.modelAttributes[attr].start + (deltaValue * value)});
        }
    } else if (delta.includes('-')) {
        deltaValue = Number(delta.slice(delta.indexOf('-'), 1));
        if (deltaValue) {
            thisBot.editAttribute({attributeName: attr, value: tags.modelAttributes[attr].start - (deltaValue * value)});
        }
    } else if (delta.includes('/')) {
        deltaValue = Number(delta.slice(delta.indexOf('/'), 1));
        if (deltaValue) {
            thisBot.editAttribute({attributeName: attr, value: tags.modelAttributes[attr].start / (deltaValue * value)});
        }
    } else if (delta.includes('*')) {
        deltaValue = Number(delta.slice(delta.indexOf('*'), 1));
        if (deltaValue) {
            thisBot.editAttribute({attributeName: attr, value: tags.modelAttributes[attr].start * (deltaValue * value)});
        }
    }
}