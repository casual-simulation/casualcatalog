if (tags.awaitingText) {
    thisBot.textResponse(tags.awaitingText);
    setTagMask(thisBot, "awaitingText", null);
}