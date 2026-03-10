if (!links.targetBot) {
    // Ignore physical keyboard keystrokes if we do not have a target bot.
    return;
}

const { keys } = that;

for (let key of keys) {
    if (tags.debug) {
        console.log(`[${tags.system}.${tagName}] physical keyboard key down:`, key);
    }
    
    thisBot.keyClick({ key, physical: true });
}