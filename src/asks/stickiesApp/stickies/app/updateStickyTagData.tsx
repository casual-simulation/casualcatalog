const stickyBot = getBot('sticky', true);
const ignoredTags = [
    'abIgnore',
    'color',
    'home',
    'homeX',
    'homeY',
    'homeZ',
    'label',
    'labelColor',
    'lastUpdateHash',
    'sticky',
    'stickyAddress',
    'selected',
    'strokeColor',
    'strokeWidth',
    'scaleX',
    'scaleY',
    'scaleZ',
    'system',
]

const payload = {...stickyBot.tags};
for (var t of ignoredTags) {
    delete payload[t];
}

tags.stickyTags = `🧬${JSON.stringify(payload)}`;
os.toast("Updated note data for future notes");
