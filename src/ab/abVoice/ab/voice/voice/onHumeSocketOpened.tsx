if (tags.awaitingText) {
    thisBot.sendUserInput(tags.awaitingText);
    setTagMask(thisBot, "awaitingText", null);
}