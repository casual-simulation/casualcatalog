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
        shout('abMenuRefresh');
    `
}

ab.links.menu.abCreateMenuButton(actionMenuButton);
ab.links.menu.abCreateMenuButton(resetTriggersButton);
