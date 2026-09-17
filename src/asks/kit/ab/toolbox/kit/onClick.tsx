if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

ab.links.manifestation.equipKit({kit: tags.kitId, kitBot: '🔗' + thisBot.id, abFormAddress: tags.abFormAddress, abBaseScale: tags.abBaseScale, abScale: tags.abScale, abOffset: tags.abOffset, abOrientationMode: tags.abOrientationMode, abAnimationOverride: tags.abAnimationOverride})