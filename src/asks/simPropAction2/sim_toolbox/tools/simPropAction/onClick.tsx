if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') {
        return;
    }
}

const triggerBot = getBot("choosingTrigger", true);
const completionTriggerBot = getBot("choosingCompletionTrigger", true);

if (triggerBot) {
    if (triggerBot == thisBot) {
        tags.choosingTrigger = false;
        tags.choosingTriggerFilter = false;
    } else {
        if (triggerBot.tags.choosingTriggerFilter == true) {
            triggerBot.addTriggerFilter(thisBot);
        } else {
            triggerBot.addTrigger(thisBot);
        }
        tags.color = tags.prevColor;
        tags.prevColor = null;
        return;
    }
}

if (tags.choosingCompletionTrigger) {
    tags.choosingCompletionTrigger = false;
} else {
    if (completionTriggerBot) {
        completionTriggerBot.addCompletionTrigger(thisBot);
        tags.color = tags.prevColor;
        tags.prevColor = null;
        return;
    }
}

if (tags.choosingHideTrigger) {
    tags.choosingHideTrigger = false;
}

// os.toast('hello, world!');
shout('abMenuRefresh');
shout("clearSimActionMenu");

configBot.tags.menuPortal = 'simAction_menu';

const menuOptions = {
    simAction_menu: true,
    clearSimActionMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    action: getLink(thisBot)
}

ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: tags.abConfiguratorGroup});