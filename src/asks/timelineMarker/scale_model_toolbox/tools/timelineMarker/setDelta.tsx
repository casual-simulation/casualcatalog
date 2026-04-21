const markerTime = tags.timeValue;
const deltaTime = that;

if (markerTime <= deltaTime) {
    tags.color = '#084a96';
} else {
    tags.color = '#031f40';
}