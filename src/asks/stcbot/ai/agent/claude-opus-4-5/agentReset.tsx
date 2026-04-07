const keepArm = that?.keepArm;

if (masks.armBot && !keepArm) {
    destroy(links.armBot);
    masks.armBot = null;
}

const savedArmBot = keepArm ? masks.armBot : null;

clearTagMasks(thisBot);

if (savedArmBot) {
    masks.armBot = savedArmBot;
}

shout('onABAIAgentReset');

if (globalThis.abRemember) {
    abRemember.masks.abBuilderIdentity = null;
}
