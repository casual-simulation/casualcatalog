let botColor;
let labelColor;

if (tags.abPatchInvalid || tags.abPatchError) {
    botColor = 'firebrick';
    labelColor = 'white';
} else {
    botColor = 'white',
    labelColor = 'black';
}

if (tags.abPatchLabelColor !== labelColor) {
    tags.abPatchLabelColor = labelColor;
}

if (tags.abPatchLabelBackgroundColor !== botColor) {
    tags.abPatchLabelBackgroundColor = botColor;
}

if (tags.color !== botColor) {
    tags.color = botColor;
}

if (tags.strokeColor !== botColor) {
    tags.strokeColor = botColor;
}