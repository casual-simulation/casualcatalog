const value = that;

for (const attr in tags.modelAttributes) {

    const deltaMod = tags.modelAttributes[attr].deltaModifier;
    let endValue;   

    let amount = (tags.modelAttributes[attr].delta * value);
    
    if (deltaMod == '+') {
        endValue = tags.modelAttributes[attr].start + amount;
    } else if (deltaMod == '-') {
        endValue = tags.modelAttributes[attr].start - amount;
    } else if (deltaMod == '/') {
        endValue = tags.modelAttributes[attr].start / amount;
    } else if (deltaMod == '*') {
        endValue = tags.modelAttributes[attr].start * amount;
    }

    // const convertedEndValue = convertToUnit(endValue, tags.modelAttributes[attr].timeUnit);

    thisBot.editAttribute({attributeName: attr, value: endValue});
}