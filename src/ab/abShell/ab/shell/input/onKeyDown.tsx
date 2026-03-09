if (ab.links.remember.tags.abAllowChatBar === false || !ab.abIsPrimary()) {
    return;
}

const { keys } = that;

if (masks.chatOpen) {
    const esc = that.keys.includes('Escape');

    if (esc) {
        thisBot.abChatBarClose();
    } else {
        const arrowUp = that.keys.includes('ArrowUp');
        const arrowDown = that.keys.includes('ArrowDown');
        
        if (arrowUp || arrowDown) {
            // If ArrowUp or ArrowDown are pressed while the ab chat bar is open then
            // start combing through chat history.
            const dir = arrowUp ? -1 : 1;
            const index = thisBot.vars.historyIndex + dir;
            let historicalText = null;

            if (index >= 0 && index < thisBot.vars.chatHistory.length) {
                historicalText = thisBot.vars.chatHistory[index];
                thisBot.vars.historyIndex = index;
            } else if (index < 0) {
                thisBot.vars.historyIndex = -1;
            } else if (index >= thisBot.vars.chatHistory.length) {
                thisBot.vars.historyIndex = thisBot.vars.chatHistory.length;
            }

            // Update the chat bar.
            await thisBot.abChatBarClose();
            thisBot.abChatBarOpen({ prefill: historicalText });
        }
    }
} else {
    const backtick = that.keys.includes('`') || that.keys.includes("Dead");

    if (backtick) {
        thisBot.vars.historyIndex = thisBot.vars.chatHistory.length;
        thisBot.abChatBarOpen();
    }
}
