if (!links.learn.abIsPrimary()) {
    return;
}

if (!tags.activeInsts) {
    setTagMask(thisBot, "activeInsts", []);
}

if (tags.activeInsts.includes(that)) {
    masks.activeInsts.splice(masks.activeInsts.indexOf(that), 1);
}