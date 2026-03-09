if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    action: getLink(thisBot)
}

const actionMenuButton = {
    ...menuOptions,
    formAddress: 'science',
    label: 'react',
    abMenuSortOrder: -1,
    onClick: `@
        links.action.react();
        shout('abMenuRefresh');
    `
}

const resetRoleTagsButton = {
    ...menuOptions,
    formAddress: 'replay',
    label: 'reset role tags',
    onClick: `@
        links.action.tags.roleTags = [];
        shout('abMenuRefresh');
        shout("clearSimActionMenu");

        links.action.onClick();
    `
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

const resetTriggerFilterButton = {
    ...menuOptions,
    formAddress: 'replay',
    label: 'reset trigger filter',
    onClick: `@
        links.action.tags.actionTriggerFilter = null;
        links.action.tags.lineTo = null;
        links.action.resetLineTo();
        shout('abMenuRefresh');
    `
}

ab.links.menu.abCreateMenuButton(actionMenuButton);
ab.links.menu.abCreateMenuButton(resetRoleTagsButton);
ab.links.menu.abCreateMenuButton(resetTriggersButton);
ab.links.menu.abCreateMenuButton(resetTriggerFilterButton);
