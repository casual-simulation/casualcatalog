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

    thisBot.editAttribute({attributeName: tags.modelAttributes[attr].name, value: endValue});
}