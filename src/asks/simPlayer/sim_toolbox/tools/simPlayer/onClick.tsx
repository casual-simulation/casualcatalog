shout('abMenuRefresh');
shout("clearSimPlayerMenu");

//handle right click
if (that) {
    if (that.modality == 'mouse' && that.buttonId == 'right') { 
        return;
    }
}



configBot.tags.menuPortal = 'simPlayer_menu';

const menuOptions = {
    simPlayer_menu: true,
    clearSimPlayerMenu: `@destroy(thisBot);`,
    abMenuRefresh: "@ destroy(thisBot);",
    simPlayer: getLink(thisBot)
}

//if already occupied, do nothing
if (tags.remoteID) {
    const roleBot = getBot("simID", tags.chosenRole);
    const goToPlaceButton = {
        ...menuOptions,
        label: "travel to default place",
        roleBot: getLink(roleBot),
        onClick: `@
            configBot.tags.gridPortal = links.roleBot.tags.defaultPlace;
            shout("clearSimPlayerMenu");
        `
    }
    if (roleBot.tags.defaultPlace) {
       ab.links.menu.abCreateMenuButton(goToPlaceButton); 
    }

    return;
}

//create role dropdown
const roleChoice = {
    ...menuOptions,
    label: "choose a role",
    dropdownSortOrder: 1,
    defaultOpen: true,
    dropdownOptions: []
}

const roleBots = getBots(byTag("simRole", true));
for (let i = 0; i < roleBots.length; ++i) {

    const numAllowed = roleBots[i].tags.numUsers ?? 1;
    if (roleBots[i].tags.roleOwner && roleBots[i].tags.roleOwner.length >= numAllowed) {
        continue;
    }

    const tempRoleButton = {
        ...menuOptions,
        label: roleBots[i].tags.roleName,
        roleID: roleBots[i].tags.simID,
        onClick: `@
            links.simPlayer.chooseRole(tags.roleID);
            shout("clearSimPlayerMenu");
        `
    }

    roleChoice.dropdownOptions.push(tempRoleButton);
}

//If no roles left, notify the user, move on
if (roleChoice.dropdownOptions.length == 0) {
    os.toast("There are no remaining roles.");
    return;
}
ab.links.menu.abCreateMenuDropdown(roleChoice);



