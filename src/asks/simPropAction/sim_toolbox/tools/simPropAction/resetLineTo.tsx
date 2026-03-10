const triggers = tags.actionTriggers ?? [];
const completionTriggers = tags.completionTriggers ?? [];
const triggerFilter = tags.actionTriggerFilter ?? [];

const newLineTo = [];

for (let i = 0; i < triggers.length; ++i) {
    const tempTriggerBot = getBot("simID", triggers[i]);
    if (tempTriggerBot) {
        newLineTo.push(tempTriggerBot.id);
    }
}

for (let i = 0; i < completionTriggers.length; ++i) {
    const tempCompletionTriggerBot = getBot("simID", completionTriggers[i]);
    if (tempCompletionTriggerBot) {
        newLineTo.push(tempCompletionTriggerBot.id);
    }
}

for (let i = 0; i < hideTriggers.length; ++i) {
    const tempHideTriggerBot = getBot("simID", hideTriggers[i]);
    if (tempHideTriggerBot) {
        newLineTo.push(tempHideTriggerBot.id);
    }
}

for (let j = 0; j < triggerFilter.length; ++j) {
    const tempTriggerFilterBot = getBot("simID", triggerFilter[j]);
    if (tempTriggerFilterBot) {
        newLineTo.push(tempTriggerFilterBot.id);
    }
}

tags.lineTo = newLineTo;