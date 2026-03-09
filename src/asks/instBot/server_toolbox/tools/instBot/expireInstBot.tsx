if (tags.expiredInstBot) {
    return;
}

setTagMask(thisBot, 'expiredInstBot', true, "shared");
setTagMask(thisBot, 'color', 'gray', "shared");
setTagMask(thisBot, 'strokeColor', 'white', "shared");
setTagMask(thisBot, 'label', 'expired', "shared");
setTagMask(thisBot, 'labelColor', 'white', "shared");
setTagMask(thisBot, 'labelFloatingBackgroundColor', 'gray', "shared");
setTagMask(thisBot, 'onClick', `@`, "shared");
setTagMask(thisBot, 'cursor', null, "shared");
setTagMask(thisBot, 'onPointerEnter', `@`, "shared");