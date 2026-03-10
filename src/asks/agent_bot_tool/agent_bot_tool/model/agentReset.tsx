if (masks.armBot) {
    destroy(links.armBot);
    masks.armBot = null;
}

clearTagMasks(thisBot);

shout('onABAIAgentReset');

if (globalThis.abRemember) {
    abRemember.masks.abBuilderIdentity = null;
}