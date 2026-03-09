const { bot, modality, buttonId } = that;

if (modality === 'mouse' || modality === 'touch') {
    if (bot.tags.teleXRFocusOnClick) {
        const zoom = bot.tags.teleXRFocusZoom ?? 100;
        os.focusOn(bot, { zoom }).catch(() => {});
    }
} 