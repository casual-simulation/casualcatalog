setTagMask(thisBot, "muted", !tags.muted);

const menuBot = getBot(byTag("baseSkill", '🔗' + getID(thisBot)), byTag("abMenu", true));
if (menuBot) {
    if (tags.muted) {
        menuBot.tags.label = "unmute";
        menuBot.tags.formAddress = 'mic_off';
    } else {
        menuBot.tags.label = "mute";
        menuBot.tags.formAddress = 'mic';
        
        if (links.voice && !links.voice.vars.humeSocket) {
            links.voice.startHume();
        }
    }
}