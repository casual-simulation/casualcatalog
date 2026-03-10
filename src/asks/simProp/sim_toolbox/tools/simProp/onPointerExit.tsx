const triggerBot = getBot("choosingProp", true);

if (triggerBot) {
    tags.color = tags.prevColor;
    tags.prevColor = null;
}