if (configBot.tags.keyboard_Meta === 'held' ||
    configBot.tags.keyboard_Control === 'held'
) {
    // Duplicate
    if (that.keys.includes('d')) {
        whisper(thisBot, 'onDuplicate')
    }
}
