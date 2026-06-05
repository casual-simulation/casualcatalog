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
const avatarBot = getBot(byTag("mapAvatar", true), byTag("ownerID", authBot?.id));
if (avatarBot) {
    const dimension = tags.dimension ?? 'home';
    avatarBot.onPlaceClicked({
        dimension: dimension,
        x: tags[dimension + 'X'],
        y: tags[dimension + 'Y']
    })
}
thisBot.showConfirmationMenu();