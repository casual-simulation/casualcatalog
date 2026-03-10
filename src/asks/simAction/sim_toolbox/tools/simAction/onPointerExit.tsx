const triggerBot = getBot("choosingTrigger", true);
const completionTriggerBot = getBot("choosingCompletionTrigger", true);

if (triggerBot || completionTriggerBot) {
    tags.color = tags.prevColor;
    tags.prevColor = null;
}