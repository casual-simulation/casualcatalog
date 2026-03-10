if (!tags.actionTriggers) {
    tags.actionTriggers = [];
}

if (!tags.lineTo) {
    tags.lineTo = [];
}

const simID = that?.tags?.simID;

if (simID) {
    if (!tags.actionTriggers.includes(simID)) {
        tags.actionTriggers.push(simID);
        tags.lineTo.push(that?.id);
    }
}

tags.choosingProp = false;