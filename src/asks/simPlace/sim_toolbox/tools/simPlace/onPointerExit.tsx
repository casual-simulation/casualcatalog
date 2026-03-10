const doorBot = getBot("choosingDoor", true);

if (doorBot) {
    tags.color = tags.prevColor;
    tags.prevColor = null;
}