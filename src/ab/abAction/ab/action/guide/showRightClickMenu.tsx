const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    teleprompter: getLink(thisBot)
}

const refresh = {
    ...menuOptions,
    label: "reset",
    formAddress: 'refresh',
    onClick: `@
        links.teleprompter.onGridClick();
        links.teleprompter.masks.menuData = null;
        links.teleprompter.masks.conversationHistory = null;
        shout("abMenuRefresh");
    `
}

ab.links.menu.abCreateMenuButton(refresh);