let action = false;
let hide = false;
let complete = false;

if (tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that?.tags?.simID)) {
    action = true;
}

if (tags.completionTriggers && tags.completionTriggers.length != 0 && tags.completionTriggers.includes(that?.tags?.simID)) {
    hide = true;
}

if (tags.hideTriggers && tags.hideTriggers.length != 0 && tags.hideTriggers.includes(that?.tags?.simID)) {
    complete = true;
}

if (action || hide || complete) {
    thisBot.resetLineTo();
}