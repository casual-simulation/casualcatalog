const { propertyValues } = that;

if ('simID' in propertyValues) {
    tags.simID = propertyValues.simID;
}

if ('label' in propertyValues) {
    tags.label = propertyValues.label;
}

await os.sleep(0);
thisBot.resetLineTo();

if (tags.simID) {
    tags.propLocked = true;
}