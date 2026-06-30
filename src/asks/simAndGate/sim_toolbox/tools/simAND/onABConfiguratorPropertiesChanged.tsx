const { propertyValues } = that;

if ('simID' in propertyValues) {
    tags.simID = propertyValues.simID;
}

if ('triggers' in propertyValues) {
    tags.actionTriggers = propertyValues.triggers;
}

await os.sleep(0);
thisBot.resetLineTo();