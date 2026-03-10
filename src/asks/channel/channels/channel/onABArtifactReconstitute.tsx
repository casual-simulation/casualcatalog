const data = that.data;

tags.bios = data.bios;
tags.instName = data.instName;
tags.defaultPattern = data.defaultPattern;
tags.defaultPatternStudio = data.defaultPatternStudio;
tags.channelName = data.channelName;
tags.onChannelLoaded = data.onChannelLoaded;

//thisBot.onChannelLoaded();
shout("onChannelReconstituted", thisBot);