const value = that.value;
const unit = that.unit;

function convertToSeconds(value: number, unit: string) {
    if (unit == 'minute') {
        return value * 60;
    } else if (unit == 'hour') {
        return value * 3600;
    } else if (unit == 'day') {
        return value * 86400;
    }  else if (unit == 'week') {
        return value * 604800;
    } else if (unit == 'month') {
        return value * 2.628e+6;
    } else if (unit == 'quarter') {
        return value * 7862400;
    } else if (unit == 'year') {
        return value * 3.154e+7;
    } else  {
        return undefined;
    }
}

function convertToUnit(value: number, unit: string) {
    if (unit == 'minute') {
        return Math.round((value / 60) * 100) / 100;
    } else if (unit == 'hour') {
        return Math.round((value / 3600) * 100) / 100;
    } else if (unit == 'day') {
        return Math.round((value / 86400) * 100) / 100;
    }  else if (unit == 'week') {
        return Math.round((value / 604800) * 100) / 100;
    } else if (unit == 'month') {
        return Math.round((value / 2.628e+6) * 100) / 100;
    } else if (unit == 'quarter') {
        return Math.round((value / 7862400) * 100) / 100;
    } else if (unit == 'year') {
        return Math.round((value / 3.154e+7) * 100) / 100;
    } else  {
        return undefined;
    }
}

for (const attr in tags.modelAttributes) {
    const convertedValue = convertToSeconds(value, unit);

    const deltaMod = tags.modelAttributes[attr].deltaModifier;
    let endValue;   

    let amount = (tags.modelAttributes[attr].delta * convertedValue);
    let convertedAmount = convertToUnit(amount, tags.modelAttributes[attr].timeUnit)
    
    if (deltaMod == '+') {
        endValue = tags.modelAttributes[attr].start + convertedAmount;
    } else if (deltaMod == '-') {
        endValue = tags.modelAttributes[attr].start - convertedAmount;
    } else if (deltaMod == '/') {
        endValue = tags.modelAttributes[attr].start / convertedAmount;
    } else if (deltaMod == '*') {
        endValue = tags.modelAttributes[attr].start * convertedAmount;
    }

    // const convertedEndValue = convertToUnit(endValue, tags.modelAttributes[attr].timeUnit);

    thisBot.editAttribute({attributeName: attr, value: endValue});
}