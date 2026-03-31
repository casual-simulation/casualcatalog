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
        return value / 60;
    } else if (unit == 'hour') {
        return value / 3600;
    } else if (unit == 'day') {
        return value / 86400;
    }  else if (unit == 'week') {
        return value / 604800;
    } else if (unit == 'month') {
        return value / 2.628e+6;
    } else if (unit == 'quarter') {
        return value / 7862400;
    } else if (unit == 'year') {
        return value / 3.154e+7;
    } else  {
        return undefined;
    }
}

for (const attr in tags.modelAttributes) {
    
    const convertedStart = convertToSeconds(tags.modelAttributes[attr].start, tags.modelAttributes[attr].unit)
    const convertedRate = convertToSeconds(tags.modelAttributes[attr].delta, tags.modelAttributes[attr].unit);
    const convertedValue = convertToSeconds(value, unit);

    const deltaMod = tags.modelAttributes[attr].deltaMod;
    let endValue;   
    
    if (deltaMod == '+') {
        endValue = convertedStart + (convertedRate * convertedValue);
    } else if (deltaMod == '-') {
        endValue = convertedStart - (convertedRate * convertedValue);
    } else if (deltaMod == '/') {
        endValue = convertedStart / (convertedRate * convertedValue);
    } else if (deltaMod == '*') {
        endValue = convertedStart * (convertedRate * convertedValue);
    }

    const convertedEndValue = convertToUnit(endValue, tags.modelAttributes[attr].unit);
    thisBot.editAttribute({attributeName: attr, value: convertedEndValue});
}