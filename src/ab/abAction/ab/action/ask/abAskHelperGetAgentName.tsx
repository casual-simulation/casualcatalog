const { abBot } = that.askContext as ABAskContext;

// Default to ab's identity.
let name = ab.links.personality.tags.abBuilderIdentity;

if (abBot.tags.abAgent) {
    // If agent, use agent name or ai model.
    name = abBot.tags.agentName ?? abBot.tags.aiModel;
}

return name;