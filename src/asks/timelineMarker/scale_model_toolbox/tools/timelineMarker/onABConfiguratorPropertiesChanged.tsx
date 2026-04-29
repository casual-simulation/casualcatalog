const { propertyValues } = that;

if ('unit' in propertyValues) {
    tags.timeUnit = propertyValues.unit.value;
}

if ('step' in propertyValues) {
    tags.timeValue = propertyValues.step;
}