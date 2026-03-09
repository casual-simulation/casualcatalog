

const dim = os.getCurrentDimension();

const botData = {
    color: "#f9c74f",
    labelColor: '#000000',
    abIgnore: true,
    sticky: true,
    scaleX: 0.9,
    scaleY: 0.9,
    scaleZ: 0.125,
    ...tags.stickyTags
}
botData[dim] = true;

create(botData);