const data = that.data;

tags.completedActions = [];
tags.queuedActions = [];

tags.chosenRole = data.chosenRole;

tags.simUser = data.simUser;

setTagMask(thisBot, "abIgnore", true, "shared");
