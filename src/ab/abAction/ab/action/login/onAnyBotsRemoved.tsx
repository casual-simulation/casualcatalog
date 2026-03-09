if (that.botIDs && thisBot.vars.authBotId) {
    const removedAuthBotId = that.botIDs.some(id => id === thisBot.vars.authBotId);

    if (removedAuthBotId) {
        thisBot.vars.authBotId = null;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] auth bot removed. authBot id: ${removedAuthBotId}`);
        }

        shout('onABAuthBotRemoved', { authBotId: removedAuthBotId });
    }
}