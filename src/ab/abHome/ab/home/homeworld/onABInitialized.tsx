// superShout("instCheckin", configBot.tags);

if (thisBot.isInPrimary()) {
    setTagMask(links.remember, "mapPreventFocus", true);
    thisBot.init();
} else {
    ab.links.manifestation.abSetAwake({ awake: false });
}