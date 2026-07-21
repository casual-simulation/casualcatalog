if (that.tags.includes("newChanges")) {
    const eggBot = getBot(byTag("eggConfigurator", true), byTag('chosenEggName', 'home'));
    if (eggBot) {
        if (tags.newChanges) {
            setTagMask(eggBot, "color", "#A4DD00", "shared");
            setTagMask(eggBot, "label", "save home changes", "shared");
            // setTagMask(thisBot, "abCoreMenuHide", false, "shared");
        } else {
            setTagMask(eggBot, "color", null, "shared");
            setTagMask(eggBot, "label", null, "shared");
            // setTagMask(thisBot, "abCoreMenuHide", true, "shared");
        }
    }
}
