tags.studioId = that.studioId;
tags.label = that.displayName.toLocaleLowerCase() + ' catalog';

await thisBot.applyStudioConfig();
thisBot.loadCasualKit();