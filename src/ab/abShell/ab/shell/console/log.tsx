let botTags = {};

const _timestamp = os.isCollaborative() ? os.agreedUponTime : os.localTime

if (typeof that === 'string') {
    const _messageText = String(that).split(': ');
    const _name = _messageText.shift();

    if (!that.includes(': ')) {
        botTags = {
            space: "tempLocal",
            name: "",
            message: that,
            abIgnore: true,
            consoleLogMessageBot: true,
            timestamp: _timestamp,
            clearConsoleLogBots: "@destroy(this)"
        }
    } else {
        botTags = {
            space: "tempLocal",
            name: _name,
            message: _messageText.join(': '),
            abIgnore: true,
            consoleLogMessageBot: true,
            timestamp: _timestamp,
            clearConsoleLogBots: "@destroy(this)"
        }
    }

} else {
    botTags = {
        space: "tempLocal",
        abIgnore: true,
        consoleLogMessageBot: true,
        timestamp: _timestamp,
        clearConsoleLogBots: "@destroy(this)",
        ...that
    }
}

const logBot = await create(botTags);

shout("onABLog", logBot);

if (thisBot.vars.updateLog) thisBot.vars.updateLog();