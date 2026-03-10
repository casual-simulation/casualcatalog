if (tags.active && that.keys.includes('Escape')) {
    if (thisBot.vars.onEscapeKeyPress) {
        for (let callback of thisBot.vars.onEscapeKeyPress) {
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
}