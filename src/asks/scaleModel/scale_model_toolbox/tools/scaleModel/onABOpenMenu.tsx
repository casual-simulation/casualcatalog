if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    model: getLink(thisBot)
}

const clearAttrButton = {
    ...menuOptions,
    formAddress: 'delete_forever',
    label: 'clear attributes',
    onClick: `@
        links.model.tags.modelAttributes = {};
        shout('abMenuRefresh');
    `
}

const modelMenuButton = {
    ...menuOptions,
    formAddress: 'lock_open',
    label: 'unlock',
    onClick: `@
        links.model.tags.modelLocked = false;
        shout('abMenuRefresh');
        shout("clearScaleModelMenu");

        links.model.onClick();
    `
}

ab.links.menu.abCreateMenuButton(clearAttrButton);
if (tags.modelLocked) {
    ab.links.menu.abCreateMenuButton(modelMenuButton); 
}