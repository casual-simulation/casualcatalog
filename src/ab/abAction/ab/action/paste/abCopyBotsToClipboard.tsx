let bots = that.bots;
let onPreprocessBeforeCopy = that.onPreprocessBeforeCopy;
let sourceEvent = that.sourceEvent;

let botsToCopy = [];

if (Array.isArray(bots)) {
    for (const bot of bots) {
        if (ab.links.utils.isBot(bot)) {
            botsToCopy.push(bot);
        }
    }
} else {
    if (ab.links.utils.isBot(bots)) {
        botsToCopy.push(bots);
    }
}

if (botsToCopy.length > 0) {
    // Let all bots know that ab is about to copy some bots.
    await Promise.allSettled(shout('onABBeforeCopyBotsToClipboard', { bots: botsToCopy, sourceEvent }));
    
    const state = {};

    for (const bot of botsToCopy) {
        state[bot.id] = JSON.parse(JSON.stringify(bot));
    }

    // Do a preprocessing pass that allows listeners to preprocess the bot data before it is copied.
    const preprocessArg = { botData: state, sourceEvent };

    if (onPreprocessBeforeCopy) {
        await onPreprocessBeforeCopy(preprocessArg);
    }

    await Promise.allSettled(shout('onABPreprocessBeforeCopyBotsToClipboard', preprocessArg));
    
    // Serialize to v1 aux file, and then copy to clipboard.
    const aux = JSON.stringify({ version: 1, state });
    os.setClipboard(aux);

    ab.links.utils.abLogAndToast(`copied ${botsToCopy.length > 1 ? 'bots' : 'bot'} to clipboard`);
}