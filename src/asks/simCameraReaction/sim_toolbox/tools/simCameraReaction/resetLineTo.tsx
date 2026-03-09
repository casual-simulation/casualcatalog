const triggers = tags.actionTriggers ?? [];
const triggerFilter = tags.actionTriggerFilter ?? [];

const newLineTo = [];

for (let i = 0; i < triggers.length; ++i) {
    const tempTriggerBot = getBot("simID", triggers[i]);
    if (tempTriggerBot) {
        newLineTo.push(tempTriggerBot.id);
    }
}

for (let j = 0; j < triggerFilter.length; ++j) {
    const tempTriggerFilterBot = getBot("simID", triggerFilter[j]);
    if (tempTriggerFilterBot) {
        newLineTo.push(tempTriggerFilterBot.id);
    }
}

tags.lineTo = newLineTo;