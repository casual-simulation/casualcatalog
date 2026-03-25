let botColor;
let labelColor;

if (tags.abPatchInvalid || tags.abPatchError) {
    botColor = 'firebrick';
    labelColor = 'white';
} else {
    botColor = 'white',
    labelColor = 'black';
}