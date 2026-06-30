const triggers = tags.actionTriggers ?? [];

const newLineTo = [];

for (let i = 0; i < triggers.length; ++i) {
    const tempTriggerBot = getBot("simID", triggers[i]);
    if (tempTriggerBot) {
        newLineTo.push(tempTriggerBot.id);
    }
}

tags.lineTo = newLineTo;