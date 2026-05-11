// superShout("instCheckin", configBot.tags);

if (links.learn.abIsPrimary()) {
    setTagMask(links.remember, "mapPreventFocus", true);
    thisBot.init();
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}