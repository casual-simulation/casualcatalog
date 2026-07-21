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
    groupSortOrder: -2,
    abMenuSortOrder: -2,
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

//EDIT
const editButton = {
    ...menuOptions,
    label: 'edit',
    scaleModel_menuSortOrder: 0,
    formAddress: 'edit',
    onClick: `@
        ab.links.configurator.abOpenConfigurator({ abConfiguratorGroup: links.egg.tags.abConfiguratorGroup});
    `
}

const currentURL = new URL(configBot.tags.url);
const host = currentURL.host;

//PUBLISH ASK
const pubButton = {
    ...menuOptions,
    label: "publish to " + host + " catalog",
    formAddress: 'call_made',
    onClick: `@
        const confirm = await os.showConfirm({
            title: "confirm request",
            content: "request " + links.egg.tags.chosenEggName + " to be published to catalog?",
            confirmText: "request",
            cancelText: "cancel"
        })
        if (confirm) {
            //request ask
            ab.links.store.abPublishAskID({askID: links.egg.tags.chosenEggName, studioID: links.egg.tags.chosenStudio ?? authBot.id, patternID: links.egg.tags.chosenEggName})
        }
        links.egg.showEggSetupMenu();
    `,
    abMenuSortOrder: -1,
}

if (tags.eggConfigConfirmed && !tags.isAvatarEquipment) {
    ab.links.menu.abCreateMenuButton(editButton);
    ab.links.menu.abCreateMenuButton(pubButton);
}