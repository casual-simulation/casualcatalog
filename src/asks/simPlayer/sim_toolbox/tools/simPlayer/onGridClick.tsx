shout("clearSimPlayerMenu");

if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}

await thisBot.clearPropActions();
