setTagMask(thisBot, "muted", !tags.muted);

const menuBot = getBot(byTag("baseSkill", '🔗' + getID(thisBot)), byTag("abMenu", true));
if (menuBot) {
    if (tags.muted) {
        menuBot.tags.label = "unmute";
        menuBot.tags.formAddress = 'mic_off';
    } else {
        menuBot.tags.label = "mute";
        menuBot.tags.formAddress = 'mic';
        
        const voiceBot = getBot("system", "ab.ai.voice");
        if (voiceBot && !voiceBot.vars.humeSocket) {
            voiceBot.startHume();
        }
    }
}