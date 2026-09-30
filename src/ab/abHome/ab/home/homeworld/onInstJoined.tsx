superShout("instCheckin", JSON.stringify({"config": configBot.tags.inst, "isPrimary": links.learn.abIsPrimary()}));

if (links.learn.abIsPrimary()) {
    //prevent automatic map focus
    setTagMask(links.remember, "mapPreventFocus", true);
}