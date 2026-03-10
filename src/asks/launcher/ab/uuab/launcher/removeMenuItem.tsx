const index = that?.index;
const groupIndex = that?.groupIndex;

if (!thisBot.vars.uuabMenuData) {
    thisBot.vars.uuabMenuData = [];
}

if (!index && index != 0) {
    console.log("[UUAB Launcher]: no index provided to remove.");
    return;
}

if (groupIndex) {
    thisBot.vars.uuabMenuData[index].menuItems.splice(groupIndex, 1);
    if (thisBot.vars.uuabMenuData[index].menuItems.length == 0) {
        thisBot.vars.uuabMenuData.splice(index, 1);
    }
} else {
    thisBot.vars.uuabMenuData.splice(index, 1);
}

tags.uuabMenuData = thisBot.vars.uuabMenuData;