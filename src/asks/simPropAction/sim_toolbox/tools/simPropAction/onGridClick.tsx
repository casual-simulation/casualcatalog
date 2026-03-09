shout("clearSimActionMenu");
//shout("clearActionMenu");

if (tags.choosingTrigger) {
    tags.choosingTrigger = false;
}

if (tags.choosingTriggerFilter) {
    tags.choosingTriggerFilter = false;
}

if (tags.choosingCompletionTrigger) {
    tags.choosingCompletionTrigger = false;
}

if (tags.choosingHideTrigger) {
    tags.choosingHideTrigger = false;
}

setTagMask(thisBot, "hideAction", false);