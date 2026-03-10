if ((tags.actionTriggers && tags.actionTriggers.length != 0 && tags.actionTriggers.includes(that?.tags?.simID)) || (tags.actionTriggerFilter && tags.actionTriggerFilter.length != 0 && tags.actionTriggerFilter.includes(that?.tags?.simID))) {
    if (!tags.lineTo) {
        tags.lineTo = [];
    }

    if (!tags.lineTo.includes(that.id)) {
        tags.lineTo.push(that.id);
    }
}

if (that == thisBot) {
    thisBot.resetLineTo();
}