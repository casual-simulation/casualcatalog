const triggerBot = getBot("choosingTrigger", true);
const hideTriggerBot = getBot("choosingHideTrigger", true);
const completionTriggerBot = getBot("choosingCompletionTrigger", true);

if (triggerBot || completionTriggerBot || hideTriggerBot) {
    tags.color = tags.prevColor;
    tags.prevColor = null;
}