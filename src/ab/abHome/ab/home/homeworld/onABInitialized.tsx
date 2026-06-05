// superShout("instCheckin", configBot.tags);
configBot.tags.abStayAwake = null;
os.syncConfigBotTagsToURL(["abStayAwake"]);

if (links.learn.abIsPrimary()) {
    setTagMask(links.remember, "mapPreventFocus", true);
    thisBot.init();
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}