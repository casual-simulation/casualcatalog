if (tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that?.tags?.simID)) {
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
}