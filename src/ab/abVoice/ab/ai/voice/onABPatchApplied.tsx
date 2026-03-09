const prompt = that.abPatchAskInput?.inquiry;
const toDoBot = getBot(byTag("toDo", true), byTag("prompt", prompt));
if (toDoBot) {
    destroy(toDoBot);
}

if (tags.latestInquiry == prompt) {
    thisBot.sendToolCompleteMessage({id: tags.latestInquiryID});
}