const triggers = tags.actionTriggers ?? [];
const completionTriggers = tags.completionTriggers ?? [];
const hideTriggers = tags.hideTriggers ?? [];

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

tags.lineTo = newLineTo;