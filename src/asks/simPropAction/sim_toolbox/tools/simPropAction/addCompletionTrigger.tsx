if (!tags.completionTriggers) {
    tags.completionTriggers = [];
}

if (!tags.lineTo) {
    tags.lineTo = [];
}

const simID = that?.tags?.simID;

if (simID) {
    if (!tags.completionTriggers.includes(simID)) {
        tags.completionTriggers.push(simID);
        tags.lineTo.push(that?.id);
    }
}

tags.choosingCompletionTrigger = false;