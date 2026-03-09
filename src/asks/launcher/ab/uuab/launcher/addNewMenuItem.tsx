if (!thisBot.vars.uuabMenuData) {
    thisBot.vars.uuabMenuData = [];
}

const menuItem = {
    uuabMenu: true,
    uuabMenuSortOrder: tags.chosenOrder ?? null,
    clearUUABMenu: `@destroy(thisBot)`,
    label: tags.chosenLabel,
    color: tags.chosenColor
}

//Button type specific onClicks
switch(tags.chosenOnClick) {
    case 'info':
        menuItem.isInfo = true;
        menuItem.info = tags.chosenInfo;
        break;
    case 'link':
        menuItem.url = tags.chosenLink;
        menuItem.onClick = `@
            os.goToURL(tags.url);
        `
        break;
    case 'external_link':
        menuItem.url = tags.chosenLink;
        menuItem.onClick = `@
            os.openURL(tags.url);
            shout("clearUUABMenu");
        `
        break;
    case 'unlock':
        if (!menuItem.label) {
            menuItem.label = 'unlock';
        }
        menuItem.formAddress = 'lock';
        menuItem.launcher = getLink(thisBot);
        menuItem.onClick = `@
            links.launcher.unlockUUAB();
            shout("clearUUABMenu");
            links.launcher.showLauncherMenu();
        `
        break;
    case 'ask':
        break;
    default: 
        break;
}

//handle grouping logic
if (tags.chosenGroup) {
    const groupIndex = thisBot.vars.uuabMenuData.findIndex((item) => {
        return item?.groupID == tags.chosenGroup;
    })

    if (groupIndex != -1) {
        thisBot.vars.uuabMenuData[groupIndex].menuItems.push(menuItem);
    } else {
        thisBot.vars.uuabMenuData.push({
            groupID: tags.chosenGroup,
            groupSortOrder: tags.chosenOrder ?? thisBot.vars.uuabMenuData.length,
            menuItems: [
                {
                    ...menuItem
                }
            ]
        })
    }
} 

//if no specified group
else {
    thisBot.vars.uuabMenuData.push(menuItem);
}

tags.uuabMenuData = thisBot.vars.uuabMenuData;
console.log("[LAUNCHER MENU]: ", thisBot.vars.uuabMenuData);