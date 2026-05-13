const { abBot } = that.askContext as ABAskContext;

// Default to ab's identity.
let avatar;

if (abBot.tags.abAgent) {
    // If agent, use agent avatar.
    avatar = abBot.tags.avatar;
}

return avatar;