if (masks.mapPortalBeforeAR) {
    configBot.tags.mapPortal = masks.mapPortalBeforeAR;
}

clearTagMasks(thisBot);

configBot.masks.leftWristPortal = null;
configBot.masks.rightWristPortal = null;

const hexBot = getBot("transformer", thisBot.id);
clearTagMasks(hexBot);

shout('onABWebSlingerTeardown', { devMode: tags.devMode });