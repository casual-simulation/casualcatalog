if (links.armBot && tags.usingAgentMesh) {
    const multiSelect = links.armBot.tags.multiSelect;
    if (multiSelect) {
        thisBot.changeAnimState('SelectMultiBegin');
    } else {
        thisBot.changeAnimState('SelectSingleBegin');
    }
}