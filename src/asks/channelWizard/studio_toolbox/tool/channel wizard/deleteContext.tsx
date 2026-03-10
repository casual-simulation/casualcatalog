if (!that) {
    return;
}

const launcherBot = getBot("system", system => system.includes("channels.launchers."));
const contextMap = {...launcherBot.tags.contextMap};

delete contextMap[that.context];

launcherBot.tags.contextMap = '🧬' + contextMap;