const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    instBot: getLink(thisBot)
}

const lockButton = {
    ...menuOptions,
    label: tags.placeLocked ? 'move world link' : 'lock position',
    formAddress: tags.placeLocked ? 'zoom_out_map' : 'lock',
    abMenuSortOrder: -1,
    onClick: `@
        if (links.instBot.tags.placeLocked) {
            links.instBot.tags.placeLocked = false;
            links.instBot.tags.draggable = true;
        } else {
            links.instBot.tags.placeLocked = true;
            links.instBot.tags.draggable = false;
        }
        shout("abMenuRefresh")
    `
}

ab.links.menu.abCreateMenuButton(lockButton)