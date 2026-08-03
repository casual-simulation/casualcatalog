if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

if (!tags.instURL) {
    thisBot.showClickMenu();
    return;
}

//circle wipe
//move avatar

const dimension = tags.dimension ?? 'home';
ab.links.manifestation.onPlaceClicked({
    dimension: dimension,
    x: tags[dimension + 'X'],
    y: tags[dimension + 'Y']
})

thisBot.showConfirmationMenu();