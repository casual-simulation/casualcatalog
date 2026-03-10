const simXPBot = getBot(byTag("xp", true), byTag("xpType", "sim"), byTag("simUser", authBot.id));

if (!simXPBot) {
    return;
}

const simXPActionQueue = [...simXPBot?.tags?.queuedActions];
for (let i = 0; i < simXPActionQueue.length; ++i) {
    const action = simXPActionQueue[i];
    if (action.origin == 'propReaction') {
        await thisBot.removeActionFromQueue(action.id);
    }
}