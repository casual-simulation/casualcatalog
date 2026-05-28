const value = that;

if (tags.onDeltaOverwrite) {
    thisBot.onDeltaOverwrite(value);
    return;
}

for (const attr of tags.modelAttributes) {

    const deltaMod = attr.deltaModifier;
    let endValue;   

    let amount = (attr.delta * value);
    
    if (deltaMod == '+') {
        endValue = attr.start + amount;
    } else if (deltaMod == '-') {
        endValue = attr.start - amount;
    } else if (deltaMod == '/') {
        endValue = attr.start / amount;
    } else if (deltaMod == '*') {
        endValue = attr.start * amount;
    }

    thisBot.editAttribute({attributeName: attr.name, value: endValue});
}