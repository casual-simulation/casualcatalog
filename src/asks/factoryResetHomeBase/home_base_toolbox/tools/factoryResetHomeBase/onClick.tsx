shout("abMenuRefresh");
shout("clearFactoryResetHomeBaseMenu");
configBot.tags.menuPortal = 'factoryResetHomeBaseMenu';

const sureButton = {
    factoryResetHomeBaseMenu: true,
    clearFactoryResetHomeBaseMenu: `@destroy(thisBot)`,
    label: "are you sure?",
    factoryResetHomeBaseMenuSortOrder: 1,
    color: ab.links.personality.tags.abBaseMenuColor,
    hasBorderStyle: false,
    menuItemStyle: {
        border: 'none'
    }
}

const yesButton = {
    factoryResetHomeBaseMenu: true,
    clearFactoryResetHomeBaseMenu: `@destroy(thisBot)`,
    label: "yes",
    resetWizard: getLink(thisBot),
    onClick: `@links.resetWizard.resetHomeBase();
        shout("clearFactoryResetHomeBaseMenu");
    `,
    factoryResetHomeBaseMenuSortOrder: 2
}

const noButton = {
    factoryResetHomeBaseMenu: true,
    clearFactoryResetHomeBaseMenu: `@destroy(thisBot)`,
    label: "no",
    resetWizard: getLink(thisBot),
    onClick: `@
        shout("clearFactoryResetHomeBaseMenu");
        destroy(links.resetWizard);
    `,
    factoryResetHomeBaseMenuSortOrder: 3
}

ab.links.menu.abCreateMenuText(sureButton);
ab.links.menu.abCreateMenuButton(yesButton);
ab.links.menu.abCreateMenuButton(noButton);