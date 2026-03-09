const prompt = that.abPatchAskInput?.inquiry;

if (tags.latestInquiry == prompt) {
    thisBot.sendToolCompleteMessage({id: tags.latestInquiryID, content: "failed"});

    setTagMask(thisBot, "latestInquiry", null);
    setTagMask(thisBot, "latestInquiryID", null);
}