if (!that) {
    return;
}

const launcherBot = getBot("system", system => system.includes("channels.launchers."));
const contextMap = {...launcherBot.tags.contextMap};

contextMap[that.context] = that.data;

launcherBot.tags.contextMap = '🧬' + contextMap;