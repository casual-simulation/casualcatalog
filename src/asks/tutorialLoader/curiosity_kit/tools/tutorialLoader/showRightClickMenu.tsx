const menuOptions = {
    abMenuRefresh: `@destroy(thisBot);`,
    baseBot: getLink(thisBot)
}

// const renameButton = {
//     ...menuOptions,
//     abBotMenuIcon: 'edit',
//     abBotMenuLabel: 'rename server bot',
//     abBotMenuAction: `@const newName = await os.showInput(links.instBot.tags.instBotLabel, {
//         autoSelect: true,
//         title: 'rename this bot'
//     });
//     if (newName) {
//         links.instBot.tags.instBotLabel = newName;
//         links.instBot.updateBillboardLabel();
//     }
//     shout('abMenuRefresh');
//     `
// }

// ab.links.menu.abCreateMenuButton(renameButton);