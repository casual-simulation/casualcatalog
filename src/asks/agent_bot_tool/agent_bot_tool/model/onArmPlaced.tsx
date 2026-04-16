thisBot.askAgent({ menuType: "grid" });

if (links.armBot && tags.usingAgentMesh) {
    const multiSelect = links.armBot.tags.multiSelect;
    if (multiSelect) {
        thisBot.changeAnimState('SelectMultiEnd');
    } else {
        thisBot.changeAnimState('SelectSingleEnd');
    }
}