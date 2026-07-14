if (that.tags.includes("newChanges")) {
    if (tags.newChanges) {
        setTagMask(thisBot, "abCoreMenuHide", false, "shared");
    } else {
        setTagMask(thisBot, "abCoreMenuHide", true, "shared");
    }
}
