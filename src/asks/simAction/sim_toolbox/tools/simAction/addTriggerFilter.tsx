if (!tags.actionTriggerFilter) {
    tags.actionTriggerFilter = [];
}

if (!tags.lineTo) {
    tags.lineTo = [];
}

const simID = that?.tags?.simID;

if (simID) {
    if (!tags.actionTriggerFilter.includes(simID)) {
        tags.actionTriggerFilter.push(simID);
        tags.lineTo.push(that?.id);
    }
}

tags.choosingTrigger = false;
tags.choosingTriggerFilter = false;