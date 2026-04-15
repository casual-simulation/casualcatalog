let selectedBot = ab.links.remember.links.abBotFocus;

tags.label = `open sheet`;

tags.onKeyDown = `@ if(that.keys == "Shift"){masks.label = tags.label + " in new tab";}`;
tags.onKeyUp = `@ if(that.keys == "Shift"){masks.label = null;}`;