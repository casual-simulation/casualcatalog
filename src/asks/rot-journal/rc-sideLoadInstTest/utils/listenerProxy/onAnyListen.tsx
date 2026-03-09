if (!thisBot.vars.listeners) {
    return; // This bot has not initialized yet.
}

const { 
    name,
    that: thatParam,
    targets
} = that;

const entries = thisBot.vars.listeners[name];

if (entries && entries.length) {
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        
        let invoke = true;

        if (entry.bot) {
            // Only invoke listener if the bot is one of the targets.
            let entryBotId = typeof entry.bot === 'string' ? entry.bot : entry.bot.id;
            invoke = targets && targets.some(t => t.id === entryBotId);
        }

        if (invoke) {
            entry.listener(thatParam);
        }
    }
}