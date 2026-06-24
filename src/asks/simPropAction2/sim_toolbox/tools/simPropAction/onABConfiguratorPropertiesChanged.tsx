const { propertyValues } = that;

if ('simID' in propertyValues) {
    tags.simID = propertyValues.simID;
}

if ('label' in propertyValues) {
    tags.label = propertyValues.label;
}

if ('story' in propertyValues) {
    tags.actionStory = propertyValues.story;
}

if ('triggers' in propertyValues) {
    tags.actionTriggers = propertyValues.triggers;
}

if ('hideTriggers' in propertyValues) {
    tags.hideTriggers = propertyValues.hideTriggers;
}

if ('completionTriggers' in propertyValues) {
    tags.completionTriggers = propertyValues.completionTriggers;
}

if ('startingAction' in propertyValues) {
    tags.startingAction = propertyValues.startingAction;
}

await os.sleep(0);
thisBot.resetLineTo();