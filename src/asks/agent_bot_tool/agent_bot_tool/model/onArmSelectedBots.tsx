const selectedBots = that;

assert(!Array.isArray(selectedBots), `[${tags.system}.${tagName}] agent bots are not currently designed to support multi-selected bots. Support must be added.`);

if (Array.isArray(selectedBots)) {
    // NOTE: Not used currently but may be in the future.
    if (links.armBot && tags.usingAgentMesh) {
        thisBot.changeAnimState('SelectMultiEnd');
    }
} else {
    if (links.armBot && tags.usingAgentMesh) {
        thisBot.changeAnimState('SelectSingleEnd');
    }
}

thisBot.askAgent({ menuType: "bot", bot: selectedBots });