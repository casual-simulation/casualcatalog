if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    role: getLink(thisBot)
}

// const roleMenuButton = {
//     ...menuOptions,
//     formAddress: 'lock',
//     label: 'unlock',
//     onClick: `@
//         links.role.tags.roleLocked = false;
//         shout('abMenuRefresh');
//         shout("clearSimRoleMenu");

//         links.role.onClick();
//     `
// }

// if (tags.roleLocked) {
//     ab.links.menu.abCreateMenuButton(roleMenuButton); 
// }