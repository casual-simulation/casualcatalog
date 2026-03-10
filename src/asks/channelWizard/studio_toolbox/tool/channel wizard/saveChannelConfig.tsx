const launcherBot = getBot("system", system => system.includes("channels.launchers."));
const channelID = launcherBot?.tags?.channelID;

links.channelLoader.saveChannel(channelID)