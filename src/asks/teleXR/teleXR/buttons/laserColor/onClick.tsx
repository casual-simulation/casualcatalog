const { modality, buttonId } = that;

if (modality === 'mouse' && buttonId !== 'left') {
    return;
}

const currentColorIndex = tags.colors.indexOf(tags.color);

let nextColorIndex = currentColorIndex + 1;

if (nextColorIndex >= tags.colors.length) {
    nextColorIndex = 0;
}

masks.color = tags.colors[nextColorIndex];