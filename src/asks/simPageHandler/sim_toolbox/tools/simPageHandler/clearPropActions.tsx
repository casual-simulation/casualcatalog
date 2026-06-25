const actionQueue = [...(tags.queuedActions ?? [])];
for (let i = 0; i < actionQueue.length; ++i) {
    const action = actionQueue[i];
    if (action.origin == 'propReaction') {
        await thisBot.removeActionFromQueue(action.id);
    }
}