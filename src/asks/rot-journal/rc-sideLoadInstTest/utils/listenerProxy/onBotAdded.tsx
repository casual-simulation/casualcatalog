function addListenTagListener (bot, name, listener) {
    assert(name, `${tags.system} name is required.`);
    assert(listener && typeof listener === 'function', `${tags.system} listener function is required.`);
    
    let entries = thisBot.vars.listeners[name];
    if (!entries) {
        entries = [];
        thisBot.vars.listeners[name] = entries;
    }

    entries.push({ listener, bot });
}

function removeListenTagListener (bot, name, listener) {
    let entries = thisBot.vars.listeners[name];
    if (!entries) {
        return;
    }

    for (let i = entries.length - 1; i >= 0; i--) {
        let entry = entries[i];

        if (entry.listener != listener) {
            continue;
        }

        if (bot) {
            const botId = typeof bot === 'string' ? bot : bot.id;
            const entryBotId = typeof entry.bot === 'string' ? entry.bot : entry.bot.id;
            
            if (botId !== entryBotId) {
                continue;
            }
        }

        entries.splice(i, 1);
    }
}

globalThis.addListenTagListener = addListenTagListener;
globalThis.removeListenTagListener = removeListenTagListener;

thisBot.vars.listeners = {};