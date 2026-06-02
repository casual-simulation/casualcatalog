const { propertyValues } = that;

if ('studio' in propertyValues) {
    let val = propertyValues.studio;
    if (val == 'user') {
        val = authBot.id;
    }
    tags.chosenStudio = val;
}

if ('name' in propertyValues) {
    tags.chosenEggName = propertyValues.name;
}

if (tags.chosenEggName && tags.chosenStudio) {
    tags.eggConfigConfirmed = true;
    thisBot.lockEgg();
}