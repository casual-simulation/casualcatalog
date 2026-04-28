const isStudioOwned = configBot.tags.owner &&
    configBot.tags.owner !== 'public' &&
    configBot.tags.owner !== 'player' &&
    configBot.tags.owner !== authBot.id;

return isStudioOwned;