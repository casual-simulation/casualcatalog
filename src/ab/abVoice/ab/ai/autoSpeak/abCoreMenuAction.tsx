setTagMask(thisBot, "autoSpeak", !tags.autoSpeak);

const menuBot = getBot(byTag("baseSkill", '🔗' + getID(thisBot)), byTag("abMenu", true));
if (menuBot) {
    if (!tags.autoSpeak) {
        menuBot.tags.label = "unmute " + abPersonality.tags.abBuilderIdentity;
        menuBot.tags.formAddress = 'mic_off';
    } else {
        menuBot.tags.label = "mute " + abPersonality.tags.abBuilderIdentity;
        menuBot.tags.formAddress = 'mic';
    }
}