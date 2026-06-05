const args = that?.args ?? {};

const bots = thisBot.abAskHelperSelectInstBots({ systemTags: args.systemTags, hasTags: args.hasTags });

return bots.map((b) => ({
    id: b.id,
    system: b.tags.system,
    tagNames: Object.keys(b.tags),
}));
