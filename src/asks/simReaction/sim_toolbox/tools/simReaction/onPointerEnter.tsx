const triggerBot = getBot("choosingTrigger", true);
const completionTriggerBot = getBot("choosingCompletionTrigger", true);

if (triggerBot || completionTriggerBot) {
    tags.prevColor = tags.color;
    tags.color = '#fcba03';
}