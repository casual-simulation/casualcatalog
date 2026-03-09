if (that.bots) {
    const addedAuthBot = that.bots.find(b => b === globalThis.authBot);

    if (addedAuthBot) {
        thisBot.vars.authBotId = addedAuthBot.id;

        if (tags.debug) {
            console.log(`[${tags.system}.${tagName}] auth bot added. authBot id: ${thisBot.vars.authBotId}`);
        }

        shout('onABAuthBotAdded', { authBot: addedAuthBot });
    }
}