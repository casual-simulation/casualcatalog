shout('abMenuRefresh');
shout("clearNewMenuItemMenu");
shout("clearLauncherMenu");
shout("clearUUABMenu");

configBot.tags.menuPortal = 'uuabMenu';

if (thisBot.vars.uuabMenuData && thisBot.vars.uuabMenuData.length != 0) {
    for (let i = 0; i < thisBot.vars.uuabMenuData.length; ++i) {
        if (thisBot.vars.uuabMenuData[i].groupID) {
            ab.links.menu.abCreateMenuGroup(thisBot.vars.uuabMenuData[i]);
        } else if (thisBot.vars.uuabMenuData[i].isInfo) {
            const infoCopy = {
                ...thisBot.vars.uuabMenuData[i],
                label: thisBot.vars.uuabMenuData[i].info
            }
            ab.links.menu.abCreateMenuText(infoCopy);
        } else {
            await ab.links.menu.abCreateMenuButton(thisBot.vars.uuabMenuData[i]);
        }
    }
} else {
    os.toast("no menu items found");
}