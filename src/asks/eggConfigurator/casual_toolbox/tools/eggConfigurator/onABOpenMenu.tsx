if (that.menuType != 'abBotMenu' || ab.links.remember.links.abBotFocus != thisBot) {
    return;
}

const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    egg: getLink(thisBot)
}

const menuGroup = {
    ...menuOptions,
    groupSortOrder: -1,
    abMenuSortOrder: -1,
    menuItems: [
    ]
}

if (tags.draggable == false) {
   //move
    menuGroup.menuItems.push({
        formAddress: 'open_with',
        label: 'move egg',
        onClick: `@links.egg.moveEgg(); shout('abMenuRefresh');`
    }); 
} else {
   //lock
    menuGroup.menuItems.push({
        formAddress: 'lock',
        label: 'lock egg position',
        onClick: `@links.egg.lockEgg(); shout('abMenuRefresh');`
    });  
}


ab.links.menu.abCreateMenuGroup(menuGroup);
