if (
    that.bot.id !== thisBot.id &&
    !(configBot.tags.keyboard_Shift === 'held')
) {
    whisper(thisBot, 'onDeselect');
}