if (tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that?.tags?.simID)) {
    if (!tags.lineTo) {
        tags.lineTo = [];
    }

    if (!tags.lineTo.includes(that.id)) {
        tags.lineTo.push(that.id);
    }
}

if (tags.completionTriggers && tags.completionTriggers.length != 0 && tags.completionTriggers.includes(that?.tags?.simID)) {
    if (!tags.lineTo) {
        tags.lineTo = [];
    }

    if (!tags.lineTo.includes(that.id)) {
        tags.lineTo.push(that.id);
    }
}

if (tags.hideTriggers && tags.hideTriggers.length != 0 && tags.hideTriggers.includes(that?.tags?.simID)) {
    if (!tags.lineTo) {
        tags.lineTo = [];
    }

    if (!tags.lineTo.includes(that.id)) {
        tags.lineTo.push(that.id);
    }
}

if (that == thisBot) {
    if (tags.actionTriggers && tags.actionTriggers.length != 0) {
        for (let i = 0; i < tags.actionTriggers.length; ++i) {
            const tempBot = getBot("simID", tags.actionTriggers[i]);
            if (tempBot) {
                if (!tags.lineTo) {
                    tags.lineTo = [];
                }

                if (!tags.lineTo.includes(tempBot.id)) {
                    tags.lineTo.push(tempBot.id);
                }
            }
        }
    }

    if (tags.completionTriggers && tags.completionTriggers.length != 0) {
        for (let i = 0; i < tags.completionTriggers.length; ++i) {
            const tempBot = getBot("simID", tags.completionTriggers[i]);
            if (tempBot) {
                if (!tags.lineTo) {
                    tags.lineTo = [];
                }

                if (!tags.lineTo.includes(tempBot.id)) {
                    tags.lineTo.push(tempBot.id);
                }
            }
        }
    }

    if (tags.hideTriggers && tags.hideTriggers.length != 0) {
        for (let i = 0; i < tags.hideTriggers.length; ++i) {
            const tempBot = getBot("simID", tags.hideTriggers[i]);
            if (tempBot) {
                if (!tags.lineTo) {
                    tags.lineTo = [];
                }

                if (!tags.lineTo.includes(tempBot.id)) {
                    tags.lineTo.push(tempBot.id);
                }
            }
        }
    }
}