const { bot, modality, buttonId } = that;

if (modality === 'controller') {
    if (bot.tags.teleXRScaleOnClick) {
        const scales = bot.tags.teleXRScales ?? [1, 2, 3];
        const currentScaleIndex = scales.findIndex(s => s === (bot.tags.scale ?? 1));
        console.log('scales', scales);
        console.log('currentScaleIndex', currentScaleIndex);

        let nextScaleIndex = currentScaleIndex + 1;
        if (nextScaleIndex >= scales.length) {
            nextScaleIndex = 0;
        }
        console.log('nextScaleIndex', nextScaleIndex);

        bot.masks.scale = scales[nextScaleIndex];
    }
} 