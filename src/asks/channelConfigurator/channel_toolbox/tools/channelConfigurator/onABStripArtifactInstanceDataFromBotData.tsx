const { data } = that;

delete data.tags.chosenBIOS;
delete data.tags.chosenPattern;
delete data.tags.chosenPatternStudio;
delete data.tags.chosenInstName;
delete data.tags.chosenChannelName;
delete data.tags.channel_onChannelLoaded;
delete data.tags.channelSetupLabel;
delete data.tags[data.tags.dimension];
delete data.tags[data.tags.dimension + 'X'];
delete data.tags[data.tags.dimension + 'Y'];
delete data.tags[data.tags.dimension + 'Z'];
delete data.tags[data.tags.dimension + 'RotationX'];
delete data.tags[data.tags.dimension + 'RotationY'];
delete data.tags[data.tags.dimension + 'RotationZ'];
delete data.tags.dimension;
delete data.tags.prevBotID;