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
os.goToURL(tags.instURL); 