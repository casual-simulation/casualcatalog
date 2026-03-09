if (!tags.hideTriggers) {
    tags.hideTriggers = [];
}

if (!tags.lineTo) {
    tags.lineTo = [];
}

const simID = that?.tags?.simID;

if (simID) {
    if (!tags.hideTriggers.includes(simID)) {
        tags.hideTriggers.push(simID);
        tags.lineTo.push(that?.id);
    }
}

tags.choosingHideTrigger = false;