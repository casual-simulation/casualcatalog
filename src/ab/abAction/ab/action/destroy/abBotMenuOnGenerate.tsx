const targetBot = ab.links.remember.links.abBotFocus;

if (targetBot) {
    tags.label = 'destroy';
    tags.targetBot = getLink(targetBot);
    tags.onKeyDown = ListenerString(() => {
        if (that.keys.includes("Shift")) {
            if (links.targetBot && links.targetBot.tags.abIDOrigin) {
                // Change button to destroy all bots with same abIDOrigin.
                const targetOriginBots = getBots(b => {
                    return b.tags.abIDOrigin === links.targetBot.tags.abIDOrigin;
                })

                masks.label = 'destroy ' + links.targetBot.tags.abIDOrigin + ' (' + targetOriginBots.length + ' bots)';
                tags.targetOriginBots = getLink(targetOriginBots);
            }
        }
    });
    tags.onKeyUp = ListenerString(() => {
        if (that.keys.includes("Shift")) {
            masks.label = null;
            tags.targetOriginBots = null;
        }
    })
} else {
    // No bot to destroy.
    destroy(thisBot);
}