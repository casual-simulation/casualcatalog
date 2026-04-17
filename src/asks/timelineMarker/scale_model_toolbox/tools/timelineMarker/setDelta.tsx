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

const markerTime = convertToSeconds(tags.timeValue, tags.timeUnit);
const deltaTime = convertToSeconds(that.value, that.unit);

if (markerTime <= deltaTime) {
    tags.color = '#084a96';
} else {
    tags.color = '#031f40';
}