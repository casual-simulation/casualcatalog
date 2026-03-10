const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    abMenu: true,
    instBot: getLink(thisBot)
}

const renameButton = {
    ...menuOptions,
    formAddress: 'edit',
    label: 'rename server bot',
    onClick: `@const newName = await os.showInput(links.instBot.tags.label, {
        autoSelect: true,
        title: 'rename this bot'
    });
    if (newName) {
        links.instBot.tags.label = newName;
    }
    shout('abMenuRefresh');
    `
}

ab.links.menu.abCreateMenuButton(renameButton);