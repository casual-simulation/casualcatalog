const { propertyValues } = that;

if ('name' in propertyValues) {
    tags.chosenUUABName = propertyValues.name;
}

if ('bios' in propertyValues) {
    tags.chosenBIOS = propertyValues.bios.value;
}

if ('studio' in propertyValues) {
    tags.chosenPatternStudio = propertyValues.label;
}

if ('pattern' in propertyValues) {
    tags.chosenPattern = propertyValues.pattern;
}

if ('inst' in propertyValues) {
    tags.chosenInstName = propertyValues.inst;
}

if (tags.chosenUUABName && tags.chosenBIOS) {
    thisBot.createUUAB();
}