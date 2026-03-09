if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    prop: getLink(thisBot)
}

const propMenuButton = {
    ...menuOptions,
    formAddress: 'lock',
    label: 'unlock',
    onClick: `@
        links.prop.tags.propLocked = false;
        shout('abMenuRefresh');
        shout("clearSimPropMenu");

        links.prop.onClick();
    `
}

if (tags.propLocked) {
    ab.links.menu.abCreateMenuButton(propMenuButton); 
}