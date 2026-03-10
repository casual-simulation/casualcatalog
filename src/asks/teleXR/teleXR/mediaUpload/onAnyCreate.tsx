const { bot } = that;

if (bot.tags.abFileUpload) {
    // Mark each bot created with onFileUpload as focusable and scaleable.
    bot.tags.teleXRFocusOnClick = true;
    bot.tags.teleXRScaleOnClick = true;
    bot.tags.teleXRLaserPointable = true;
}