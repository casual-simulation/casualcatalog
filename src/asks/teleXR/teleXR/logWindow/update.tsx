const logBots = getBots(b => b.tags.consoleLogMessageBot);

logBots.sort((a, b) => {
    return new Date(a.tags.timestamp) > new Date(b.tags.timestamp) ? 1 : -1
})

const logBotsToShow = logBots.slice(-3);

if (logBotsToShow.length > 0) {
    let label = '';

    for (let i = 0; i < logBotsToShow.length; i++) {
        if (i > 0) {
            label += '\n\n'
        }

        const logBot = logBotsToShow[i];

        if (logBot.tags.name) {
            label += `${logBot.tags.name}: `;
        }

        label += `${logBot.tags.message}`

    }

    masks.label = label;
} else {
    masks.label = 'no chat messages yet';
}