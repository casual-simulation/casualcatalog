if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    action: getLink(thisBot)
}

const resetTriggersButton = {
    ...menuOptions,
    formAddress: 'replay',
    label: 'reset triggers',
    onClick: `@
        links.action.tags.actionTriggers = null;
        links.action.tags.lineTo = null;
        links.action.resetLineTo();
        shout('abMenuRefresh');
    `
}

const resetCompletionTriggersButton = {
    ...menuOptions,
    formAddress: 'replay',
    label: 'reset completion triggers',
    onClick: `@
        links.action.tags.completionTriggers = null;
        links.action.tags.lineTo = null;
        links.action.resetLineTo();
        shout('abMenuRefresh');
    `
}

const resetHideTriggersButton = {
    ...menuOptions,
    formAddress: 'replay',
    label: 'reset hide triggers',
    onClick: `@
        links.action.tags.hideTriggers = null;
        links.action.tags.lineTo = null;
        links.action.resetLineTo();
        shout('abMenuRefresh');
    `
}

ab.links.menu.abCreateMenuButton(resetTriggersButton);
ab.links.menu.abCreateMenuButton(resetCompletionTriggersButton);
ab.links.menu.abCreateMenuButton(resetHideTriggersButton);

return;