if (that.abPatchAskInput?.inquiry == tags.latestInquiry) {
    const agentBot = getBot(byID(that.abPatchAskInput?.abBot));
    if (agentBot && agentBot.tags.agent_bot_tool) {
        destroy(agentBot);
    }
    setTagMask(thisBot, "latestInquiry", null);
    setTagMask(thisBot, "latestInquiryID", null); 
}